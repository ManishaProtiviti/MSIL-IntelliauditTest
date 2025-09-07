import AdmZip from 'adm-zip';
import fsExtra from 'fs-extra';
import path from 'path';
const fse = fsExtra;
export const isZipFile = async (filePath) => {
  const buffer = await fse.readFile(filePath);
  return buffer[0] === 0x50 &&
         buffer[1] === 0x4B &&
         buffer[2] === 0x03 &&
         buffer[3] === 0x04;
};

export async function unzip(zipPath, destDir, prefixZipName = false) {
  try {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    for(const entry of zipEntries) {
      if(entry.isDirectory) continue;
      const originalPath = entry.entryName;
      if (originalPath.includes('__MACOSX')) continue;
      const ext = path.extname(originalPath).toLowerCase();
      const basename = path.basename(originalPath);
      const folderPrefix = path.dirname(originalPath).split("/").filter(Boolean).join("^");
      let prefixName = folderPrefix && folderPrefix != '.' ? `${folderPrefix}^${basename}`: basename;
      if(prefixZipName) {
        const zipName = path.basename(zipPath, path.extname(zipPath))
        prefixName = `${zipName}^${prefixName}`
      }
      const destFilePath = path.join(destDir, prefixName);
      await fse.ensureDir(destDir);
      await fse.writeFile(destFilePath, entry.getData(), { overwrite: true });
      if(ext == '.zip') {
        await unzip(destFilePath, destDir, true);
      }
    }
      await fse.remove(zipPath);
  } catch(er) {
    console.log('error while unzipping', er);
    throw new Error('zip processing failed')
  }
}