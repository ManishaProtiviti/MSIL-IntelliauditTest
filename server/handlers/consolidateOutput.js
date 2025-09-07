import path from "path";
import {Environment } from '../constants.js'
import { runPythonScript } from "./runPython.js";
import axios from 'axios';
import { checksMappingWithPythonFile } from "../api/enterprise/constants.js";
const name = 'Duplicate Forgery'

export async function consolidateOutput(sessionId, empId, uplodDateTime, cfolder, excel_path) {
  console.log("consolidateOutput",excel_path)
  // python Consolidate_Code.py "{\"current_folder\": \"C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Current Data\", 
  //  \"output_excel\": \"C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Excel Output\", 
  // \"Session_ID\": \"SESION123\",
  //  \"Employee_ID\": \"E1234\", \"Process_Timestamp\": \"2025-08-08\"}"

  const pythonExec = Environment.PYTHON_PATH; // Update path for Windows if needed
  const scriptPath = path.join(process.cwd(), "scripts","dist",'Consolidate_Code.py');
    const data = JSON.stringify({
        current_folder: cfolder, output_excel: excel_path,
        Session_ID: sessionId, Employee_ID: empId,
        Upload_Timestamp: uplodDateTime
    });

  console.log(data)
  const result = await runPythonScript(pythonExec, scriptPath, data);
  console.log('consolidateOutput python script output:', result)
  return result;
}