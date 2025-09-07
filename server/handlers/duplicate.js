import path from "path";
import {Environment } from '../constants.js'
import { runPythonScript } from "./runPython.js";
import axios from 'axios';
import { checksMappingWithPythonFile } from "../api/enterprise/constants.js";
const name = 'Duplicate Forgery'

export async function checkDuplicate(requestId, checksJsonColl) {
  if (Environment.USE_DOCKER_PYTHON) {
    axios
      .post(Environment.PYTHON_API.DUPLICATE_CHECK_URL, {
        content: JSON.stringify(checksJsonColl[name]),
      })
      .catch((e) => console.log(e));
    return;
  }
  try{
  const pythonExec = Environment.PYTHON_PATH; // Update path for Windows if needed
  const scriptPath = path.join(process.cwd(), "scripts","dist", checksMappingWithPythonFile.duplicate);
  const data = JSON.stringify(checksJsonColl[name]);
  const result = await runPythonScript(pythonExec, scriptPath, data);
  console.log('python script output:', result)
  return result;
  }
  catch(err){
    console.log("Error in Duplicate script", err);
  }
}