import { checkPdfEditForge } from "../../handlers/checkPdfEditForge.js";
import { copyMoveForge } from "../../handlers/copyMoveForge.js";
import { checkDuplicate } from "../../handlers/duplicate.js";
import { checkImageTempering } from "../../handlers/imageTempering.js";
import { metadataCheck } from "../../handlers/metadataCheck.js";
import { qrCodeCheck } from "../../handlers/qrCodeReader.js";
export const checksMappingWithPythonFile = {
  duplicate: "de-duplication.py",
  pdfEditForge: "pdf_forgery_code.py",
  metadataChk: "meta_data_code.py",
  Image_Edit_Forgery: "Image_Edit_Forgery.py",
  copyMoveForge: "Copy_Move_Forgery.py",
  qrCode: "QR_Edit_Forgery.py",
};

export const checkHandlers = {
  duplicate: (requestId, checksJsonColl) =>
    checkDuplicate(requestId, checksJsonColl),
  pdfEditForge: (requestId, checksJsonColl) =>
    checkPdfEditForge(requestId, checksJsonColl),
  metadataCheck: (requestId, checksJsonColl) =>
    metadataCheck(requestId, checksJsonColl),
   tamper: (requestId, checksJsonColl) => checkImageTempering(requestId, checksJsonColl),
   copyMoveForge: (requestId, checksJsonColl) => copyMoveForge(requestId, checksJsonColl),
   qrCode: (requestId, checksJsonColl) => qrCodeCheck(requestId, checksJsonColl) ,
};
