import path from "path";
import fsExtra from "fs-extra";
import { spawn } from "child_process";
import jwt from 'jsonwebtoken';
import {
  Environment,
  UPLOAD_ROOT_DIR,
  ensureDirectoryExists,
  getFileUrls,
} from "../../constants.js";
import { isZipFile, unzip } from "../../utils/zip.js";
import {
  mergeChunk,
  normalizeFormidableFields,
  parseForm,
  uploadChunk,
} from "../../utils/upload.js";
import { checkHandlers } from "./constants.js";
import { executeSQLQuery } from "../../configs/db/index.js";
import { handleFolderSetup } from "../../utils/folder-setup.js.js";
import { publishToQueue } from "../../configs/msmq/publisher.js";
import { consolidateOutput } from "../../handlers/consolidateOutput.js";
import { convertTimestampToNormal } from "../../utils/date-formatter.js";
// Constants
const CURRENT_DATA_DIR = "current_data";
const fse = fsExtra;

// Ensure root upload directory exists
ensureDirectoryExists(UPLOAD_ROOT_DIR);

// Handle chunk upload
export async function handleUploadChunk(req, res) {
  try {
    // Field names
    const FIELD_CHUNK = "chunk";
    const FIELD_UPLOAD_ID = "uploadId";
    const FIELD_INDEX = "index";
    const FIELD_FILE_NAME = "fileName";
    const FIELD_TOTAL_CHUNKS = "totalChunks";
    const FIELD_REQUEST_ID = "requestId";
    const { fields, files } = await parseForm(req);
    const fieldNormalize = normalizeFormidableFields(fields, [
      FIELD_UPLOAD_ID,
      FIELD_INDEX,
      FIELD_FILE_NAME,
      FIELD_TOTAL_CHUNKS,
      FIELD_REQUEST_ID,
    ]);
    const fileNormalize = normalizeFormidableFields(files, [FIELD_CHUNK]);
    const normalize = { ...fieldNormalize, ...fileNormalize };

    if (!normalize.uploadId || !normalize.index || !normalize.chunk) {
      return res.status(400).send("Missing required fields");
    }
    await uploadChunk(
      UPLOAD_ROOT_DIR,
      normalize.requestId,
      normalize.uploadId,
      normalize.chunk,
      normalize.index
    );
    if (normalize.totalChunks) {
      await handleMergeChunk(
        normalize.uploadId,
        normalize.requestId,
        //'msil_il_563425',
        normalize.fileName,
        normalize.totalChunks
      );
    }
    const outputDir = path.join(
      UPLOAD_ROOT_DIR,
      normalize.requestId,
      // 'msil_il_563425',
      CURRENT_DATA_DIR
    );
    fse.ensureDir(outputDir);
    res.status(200).send({
      status: true,
      message: "done",
      data: {
        requestId: normalize.requestId,
      },
    });
  } catch (e) {
    res.status(400).send({ status: false, message: e.message, data: null });
  }
}

// Merge all uploaded chunks into a final file
export async function handleMergeChunk(
  uploadId,
  requestId,
  fileName,
  totalChunks
) {
  if (!uploadId || !fileName || !totalChunks) {
    return res.status(400).send("Missing required fields");
  }

  const chunkDir = path.join(UPLOAD_ROOT_DIR, requestId, uploadId);
  const outputDir = path.join(UPLOAD_ROOT_DIR, requestId, CURRENT_DATA_DIR);
  const requestDir = path.join(UPLOAD_ROOT_DIR, requestId);
  const finalFilePath = path.join(outputDir, fileName);
  await fse.ensureDir(outputDir);
  try {
    // handle chunk
    await mergeChunk(chunkDir, outputDir, fileName);
    // zip process if file is zip
    const isZip = await isZipFile(finalFilePath);
    if (isZip) {
      console.log("Detected ZIP. Processing...");
      await unzip(finalFilePath, outputDir);
    }
  } catch (err) {
    console.error("Error merging chunks:", err);
    await fse.remove(requestDir);
    throw err;
  }
}

export async function handleExecuteChecks(req, res) {
  const {
    requestId,
    Employee_ID,
    Session_ID,
    Upload_Datetime,
    Total_Documents_Upload,
    Total_Size_Upload,
    Process_Start_Time,
  } = req.body;
  if (!requestId) {
    return res.status(400).send("Missing requestId");
  }
  const checksJsonColl = await handleFolderSetup(requestId);

  const insertPendingQuery = `INSERT INTO Transaction_Status (Employee_ID, Session_ID, Status, Total_Documents_Upload, 
                  Total_Size_Upload, Process_Start_Time, Process_End_Time, MetaData_Upload_Flag, Upload_Timestamp)
        VALUES ('${Employee_ID}', '${Session_ID}', 'Pending', '${Total_Documents_Upload}', '${Total_Size_Upload}',
         '${Process_Start_Time}', '0000-00-00 00:00:00', 'No', '${Upload_Datetime}')`;

  await executeSQLQuery(insertPendingQuery);

  const promises = [];
  const selectedChecks = Object.keys(req.body.checks).filter(
    (key) => req.body.checks[key] === true
  );
  selectedChecks.forEach((key) =>
    promises.push(checkHandlers[key](requestId, checksJsonColl))
  );
  await Promise.all(promises);

  // setTimeout(async () => {
    try {
      await consolidateOutput(
        Session_ID,
        Employee_ID,
        Upload_Datetime,
        checksJsonColl["Duplicate Forgery"].current_folder,
        checksJsonColl["Duplicate Forgery"].output_excel
      );
    } catch (err) {
      console.log(err, "Consolidate error");
    }

    const Process_End_Time = convertTimestampToNormal(Date.now(), false); // Note keep same format as start time.

    const updateCompleteQuery = `Update Transaction_Status Set Status = 'Completed',  Process_End_Time =  '${Process_End_Time}'
          WHERE Employee_ID = '${Employee_ID}' AND Session_ID = '${Session_ID}'AND Status = 'Pending'`;

    await executeSQLQuery(updateCompleteQuery);

    res.status(200).send("Check processing completed");
  // }, 10000);
}

export async function triggePyScript(checksJsonColl, requestId, res) {
  const checks = [
    "PDF Edit Forgery",
    "Meta Data Forgery",
    "Copy Move Forgery",
    "Image Edit Forgery",
    "Duplicate Forgery",
  ];
  // const scriptPath = path.join('C:\\MSIL\\Enterprise Application\\Session_ID\\dist', 'pdf_forgery_code.py');
  // let metadataJson = JSON.stringify(checksJsonColl['PDF Edit Forgery']);
  const scriptPath = path.join(
    "C:\\MSIL\\Enterprise Application\\Session_ID\\dist",
    "meta_data_code.py"
  );
  let metadataJson = JSON.stringify(checksJsonColl["Meta Data Forgery"]);
  // const baseString = Buffer.from(metadataJson).toString('base64');
  console.log("baseString", metadataJson);
  const proc = spawn(Environment.PYTHON_PATH, [scriptPath, metadataJson], {
    cwd: process.cwd(),
  });

  // const proc = spawn('python', [scriptPath,baseString ], {cwd: process.cwd()});
  let responded = false;

  proc.stdout.on("data", (data) => {
    if (!responded) {
      responded = true;
      console.log(`stdout: ${data.toString()}`);
      return res.status(200).json({
        message: "Script ran successfully",
        requestId,
        output: data.toString(),
      });
    }
  });

  proc.stderr.on("data", (data) => {
    if (!responded) {
      responded = true;
      console.error(`stderr: ${data.toString()}`);
      return res.status(500).json({
        message: "Script processing failed",
        requestId,
        error: data.toString(),
      });
    }
  });

  proc.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

export async function handleBulkUploadChecks(req, res) {
  const { requestId, checks } = req.body;
  if (!requestId) {
    return res.status(400).send("Missing requestId");
  }

  // await db.query(
  //     `INSERT INTO transaction_status (employee_id, session_id, process_timestamp, status)
  //     VALUES ($1, $2, $3, $4)`,
  //     [1, requestId, new Date(), 'pending']
  // );
  publishToQueue(Environment.MSIL_UPLOAD_REQUEST_QUEUE, {
    requestId,
    checks,
  });
  res
    .status(200)
    .send(
      "Bulk upload checks execution under proceess. Mail will be sent on process completion."
    );
}

export async function handleGetCurrentStatus(req, res) {
  //   const result = await db.query(
  //   `SELECT status
  //   FROM transaction_status
  //   WHERE session_id = $1
  //   ORDER BY process_timestamp DESC
  //   LIMIT 1`,
  //   [req.params.requestId]
  // );
  // const statusresult = result.rows[0];
  // if(!statusresult) {
  //   res.status(404).json({msg: 'invalid request id'});
  //   return;
  // }
  // res.status(200).json({
  //   data: {
  //     requestId: req.params.requestId,
  //     status: statusresult?.status
  //   }
  // })
}

export async function handleGetCurrentStatusDetails(req, res) {
 
  // console.log(req.params)
  const result = await executeSQLQuery(
    `SELECT * from Transaction_Output  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Upload_Timestamp = '${req.params.uploadTime}'`
  );
  if (result?.length == 0) {
    res.status(404).json({ msg: "invalid request id" });
    return;
  }

  const status_result = await executeSQLQuery(
    `SELECT * from Transaction_Status  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Upload_Timestamp = '${req.params.uploadTime}'`
  );
  // console.log(result, 'result.rows')

  res.status(200).json({
    data: {
      requestId: req.params.requestId,
      transactions: result,
      status_data: status_result,
    },
  });
}

export async function handleGetFiles(req, res) {
  // console.log("Testing",req.params.fileName)
  const checks = [
    "PDF_Edit",
    "Meta_Data",
    "Copy_Move",
    "Image_Edit",
    "Duplicate",
  ];
  let query = "";
  let folder = "";
  let Urls = [];
  if (req.params.checktype == "Duplicate") {
    //console.log("true")
    folder = "Duplicate Forgery";
    query = `SELECT * from Duplicate_Table  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Upload_Timestamp = '${req.params?.timestamp}' AND (Secondary_Document = '${req.params?.fileName}' OR Primary_Document = '${req.params?.fileName}')`;
  } else if (req.params.checktype == "PDF_Edit") {
    folder = "PDF Edit Forgery";
    query = `SELECT * from PDF_Edit_Table  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Upload_Timestamp = '${req.params?.timestamp}' AND Output_File_Name = '${req.params?.fileName}' OR Input_File_Name = '${req.params?.fileName}'`;
  } else if (req.params.checktype == "Meta_Data") {
    query = `SELECT File_Name, Creator, Creation_Date, Producer, Software, Modified_Date, Title, Author from MetaData_Table  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND File_Name = '${req.params?.fileName}' AND Upload_Timestamp = '${req.params?.timestamp}'`;
  } else if (req.params.checktype == "QR_Code") {
    query = `SELECT Input_File_Name, QR_Data, URL_Present, URL_Open, QR_Edit_Flag from QR_Code_Edit_Table  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Input_File_Name = '${req.params?.fileName}'  AND Upload_Timestamp = '${req.params?.timestamp}'`;
  } else if (req.params.checktype == "Copy_Move") {
    folder = "Copy Move Forgery";
    query = `SELECT * from Copy_Move_Edit_Table  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Input_File_Name = '${req.params?.fileName}'  AND Upload_Timestamp = '${req.params?.timestamp}'`;
  } else if (req.params.checktype == "Image_Edit") {
    folder = "Image Edit Forgery";
    query = `SELECT * from Image_Edit_Table  WHERE Session_ID = '${req.params.requestId}' AND Employee_ID = '${req.params.empId}' AND Input_File_Name = '${req.params?.fileName}'  AND Upload_Timestamp = '${req.params?.timestamp}'`;
  }

  let result = await executeSQLQuery(query);

  if (result?.length == 0) {
    res.status(404).json({ msg: "invalid request id" });
    return;
  }

  if (req.params.checktype == "PDF_Edit") {
    Urls = [result[0]["Output_File_Name"], result[0]["Input_File_Name"]];
  } else if (req.params.checktype == "Duplicate") {
    Urls = [result[0]["Secondary_Document"], result[0]["Primary_Document"]];
  } else if (
    req.params.checktype == "Copy_Move" ||
    req.params.checktype == "Image_Edit"
  ) {
    Urls = [result[0]["Output_File_Name"]];
  }

  //console.log(result, Urls, 'result.rows')
  let fileUrls = [];
  if (
    req.params.checktype == "Duplicate" ||
    req.params.checktype == "PDF_Edit" ||
    req.params.checktype == "Copy_Move" ||
    req.params.checktype == "Image_Edit"
  ) {
    fileUrls = getFileUrls(
      req.params.empId,
      req.params.requestId,
      req.params.timestamp,
      req.params.checktype,
      Urls,
      folder
    );
  } else {
    fileUrls = [];
  }
  res.status(200).json({
    data: {
      requestId: req.params.requestId,
      check_data: result,
      fileUrls: fileUrls,
    },
  });
}

export async function handleLoginDetails(req, res) {
  try {
    // console.log(req.params)
    const {
      Employee_ID,
      Session_ID,
      Employee_Name,
      Login_Timestamp,
      Employee_Department,
      Access_Type,
      Logout_Timestamp,
    } = req.body;
    
    const result = await executeSQLQuery(
      `INSERT INTO Login_Table (Employee_ID, Session_ID, Employee_Name, Login_Timestamp, Employee_Department, Access_Type, Logout_Timestamp)
       VALUES ('${Employee_ID}',  '${Session_ID}', '${Employee_Name}',
          '${Login_Timestamp}', '${Employee_Department}', '${Access_Type}',
          '${Login_Timestamp}' )`
    );
    // console.log(result, 'result.rows')

    res.status(200).json({
      message: "User detials stored successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
}

export async function handleGetLast10Reports(req, res) {
  
  // console.log(req.params)
  const result = await executeSQLQuery(
    `SELECT * from Transaction_Status WHERE Employee_ID = '${req.params.empId}' AND Status = 'Completed' ORDER BY Process_Start_Time DESC LIMIT 10`
  );
  if (result?.length == 0) {
    res.status(404).json({ msg: "invalid session Id" });
    return;
  }

  res.status(200).json({
    data: {
      transactions: result,
    },
  });
}
