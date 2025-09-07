import path from "path";
import {Environment, UPLOAD_ROOT_DIR, ensureDirectoryExists} from '../constants.js'
import { runPythonScript } from "./runPython.js";
import { checksMappingWithPythonFile } from "../api/enterprise/constants.js";
import axios from "axios";
const name = 'PDF Edit Forgery'
const folders = ["Input Files", "Image Files", "Excel Files"]

export async function checkPdfEditForge(requestId, checksJsonColl) {
  // const metadata = {};
  // const requestIdPath = path.join(UPLOAD_ROOT_DIR, requestId?.toString());
  // metadata.current_folder = path.resolve(path.join(requestIdPath, "current_data"));
  // for (const folderName of folders) {
  //   const destDir = path.join(
  //     requestIdPath,
  //     name,
  //     folderName
  //   );
  //   ensureDirectoryExists(destDir);
  //   if (folderName === "Input Files") {
  //     metadata.input_folder = path.resolve(destDir);
  //   }
  //   if (folderName === "Excel Files") {
  //     metadata.output_excel = path.resolve(destDir);
  //     // Handle excel files if needed
  //   }
  //   if (folderName == "Image Files") {
  //     metadata.image_folder = path.resolve(destDir);
  //     // Handle image files if needed
  //   }
  // }
  // console.log(`Metadata for request ${requestId}: checkPdfEditForge`, metadata);
  // const pythonExec = Environment.PYTHON_PATH // Update path for Windows if needed
  // const scriptPath = path.join(process.cwd(), "scripts", "dist", checksMappingWithPythonFile.pdfEditForge);
  // // metadata["poppler_path"] = path.join(
  //   process.cwd(),
  //   "scripts",
  //   "poppler-24.02.0",
  //   "Library",
  //   "bin"
  // );
  // const metadataJson = JSON.stringify({ paths: metadata });
  // const baseString = Buffer.from(metadataJson).toString("base64");
  // console.log(baseString)
  // axios.post("http://pdf-edit-forge:8000/check-forge", {content: baseString}).catch(e => console.log(e));

  

   if (Environment.USE_DOCKER_PYTHON) {
    axios
      .post(Environment.PYTHON_API.DUPLICATE_CHECK_URL, {
        content: JSON.stringify(checksJsonColl[name]),
      })
      .catch((e) => console.log(e));
    return;
  }
  try{
  const pythonExec = Environment.PYTHON_PATH // Update path for Windows if needed
  const scriptPath = path.join(process.cwd(), "scripts", "dist", checksMappingWithPythonFile.pdfEditForge);
  const data = JSON.stringify(checksJsonColl[name]);
 console.log("data",data)
 console.log("checkjsoncall",checksJsonColl)
  const result = await runPythonScript(pythonExec, scriptPath, data);
  console.log('Pdf Edit python script output:', result)
  return result;
  }
  catch(err){
    console.log('PDf Edit Script Error', err)
  }

}