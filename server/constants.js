import fs from 'fs'
import dotenv from "dotenv";
import path from 'path';
import { pathToFileURL } from 'url';
dotenv.config();

export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getFileUrls(employeeId, sessionId, uploadtimestamp, checkType, fileName, folder) {
  const dirPath = path.join(
    `${sessionId}_${Date.parse(uploadtimestamp)}`,
     `${folder}`,
     (checkType == "PDF_Edit" || checkType == "Copy_Move" || checkType == "Image_Edit") ? 'Output Files' : 'Input Files',
  );
console.log("dirPath",dirPath)
  // if (!fs.existsSync(dirPath)) {
  //   console.warn(`Directory does not exist: ${dirPath}`);
  //   return [];
  // }
console.log("fileName",fileName)
let fileUrls = [];
if(checkType == "PDF_Edit"  || checkType == "Copy_Move" || checkType == "Image_Edit" ){
  return [path.join(dirPath, fileName[0])]
}else{
   fileUrls = fileName.map((name)=>{
    return path.join(dirPath, name)
    
    // if(!fs.existsSync(fullPath)){
    //     return pathToFileURL(fullPath).href;                                                                                                                                                                                                                                        
    // }else{
    //   console.warn(`File does not exist: ${fullPath}`);
    //   return null;
    // }
  })
}


  return fileUrls;
}

export const Environment = {
  AMQP_URL: process.env.AMQP_URL,
  AMQP_ENABLED: process.env.AMQP_ENABLED == 'true',
  DB_HOST: process.env.DB_HOST,
  MSIL_UPLOAD_REQUEST_QUEUE: process.env.MSIL_UPLOAD_REQUEST_QUEUE,
  PORT: process.env.PORT,
  DB_USER: process.env.DB_USER,
  DB_PWD: process.env.DB_PWD,
  DB: process.env.DB,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  PYTHON_PATH: process.env.PYTHON_PATH,
  DB_PORT:process.env.DB_PORT,
  USE_DOCKER_PYTHON: process.env.USE_DOCKER_PYTHON=='true',
  PYTHON_API: {
    DUPLICATE_CHECK_URL: process.env.DUPLICATE_CHECK_URL
  },
  POPPLER_PATH: process.env.POPPLER_PATH
};

export const UPLOAD_ROOT_DIR = "uploads"