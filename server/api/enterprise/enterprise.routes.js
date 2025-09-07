import express from "express";
import {
  handleBulkUploadChecks,
  handleExecuteChecks,
  handleUploadChunk,
  handleGetCurrentStatus,
  handleGetCurrentStatusDetails,
  handleGetFiles,  
  handleLoginDetails,
  handleGetLast10Reports
} from "./enterprise.controller.js";
const router = express.Router();

router.post("/addLoginDetails", handleLoginDetails);

router.post("/upload-chunk", handleUploadChunk);

router.post("/process", handleExecuteChecks);

router.post("/bulk-upload-process", handleBulkUploadChecks);

router.get('/request/status/:requestId', handleGetCurrentStatus)

router.get('/request/status/:requestId/:empId/:uploadTime/details', handleGetCurrentStatusDetails)

router.get('/request/status/:requestId/:empId/:timestamp/:checktype/:fileName/files', handleGetFiles)

router.get('/request/:sessionId/:empId/reports', handleGetLast10Reports)

export default router;
