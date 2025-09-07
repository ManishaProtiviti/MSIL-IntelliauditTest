import fsExtra from "fs-extra";
import path from 'path';
import formidable from "formidable";
import {
  ensureDirectoryExists,
} from "../constants.js";
const fse = fsExtra;

export async function mergeChunk(chunkDir, targetDir, fileName) {
  try {
    const chunkFiles = (await fse.readdir(chunkDir)).sort((a, b) => Number(a) - Number(b));
    const targetFileName = path.join(targetDir, fileName);
    const writeStream = fse.createWriteStream(targetFileName);
    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(chunkDir, chunkFile);
      const data = await fse.readFile(chunkPath);
      writeStream.write(data);
    }
    await new Promise(resolve => writeStream.end(resolve));
    await fse.remove(chunkDir);
  } catch(e) {
    console.log('merge chunk failed', e)
  }
}

export async function uploadChunk(targetPath, requestId, name, chunk, index ) {
  const chunkDir = path.join(targetPath, requestId, name);
  ensureDirectoryExists(chunkDir);
  const chunkPath = path.join(chunkDir, index);
  await fse.copyFile(chunk.filepath, chunkPath);
}

export function normalizeFormidableFields(fields, keys) {
  const normalize = {};
  keys.forEach(key => {
    normalize[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key]
  });
  return normalize;
}

export function parseForm(req) {
  const form = formidable({});
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}