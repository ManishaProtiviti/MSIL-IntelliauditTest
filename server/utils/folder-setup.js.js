import fs from 'fs/promises';
import path from 'path';
import { Environment, UPLOAD_ROOT_DIR } from '../constants.js';

export const handleFolderSetup = async ( requestId) => {
    const checks = ['PDF Edit Forgery', 'Meta Data Forgery', 'Copy Move Forgery', 'Image Edit Forgery', 'Duplicate Forgery', 'QR Edit Forgery'];
    const folders = ['Input Files', 'Process Files', 'Output Files', 'Image Files', 'Excel Output'];
    try {

        const checksJsonColl = {};
        const claim_path = path.join(UPLOAD_ROOT_DIR, requestId);
        const excel_output = toLinuxPath(path.join(claim_path, 'Excel Output'));
        await fs.mkdir(excel_output, { recursive: true });
        checksJsonColl["Excel Output"] = excel_output;
        for (const check of checks) {
            const metadata = {};
            metadata["current_folder"] = toLinuxPath(path.join(claim_path, 'current_data'));

            let destDir = '';
            for (const folderName of folders) {
                     destDir = path.join(claim_path, check, folderName);
                if(destDir === '')
                    continue;
                await fs.mkdir(destDir, { recursive: true });
                if (folderName === 'Input Files') {
                    metadata.input_folder = toLinuxPath(destDir);
                }
                if (folderName === 'Excel Output') {
                    metadata.output_excel = toLinuxPath(excel_output);
                }
                if(folderName == 'Image Files') {
                    metadata.image_folder = toLinuxPath(destDir);
                }
                if(folderName == 'Output Files') {
                    metadata.output_folder = toLinuxPath(destDir);
                }
                if(folderName == 'Process Files') {
                    metadata.process_folder = toLinuxPath(destDir);
                }
                metadata["poppler_path"] = Environment.POPPLER_PATH;
                checksJsonColl[check] = metadata;
            }
        }
        return checksJsonColl;
    } catch (error) {
        console.error('Error in handleClaimUpload:', error);
        return res.status(500).json({ error: 'Server error during claim processing' });
    }
};


export function toLinuxPath(filePath) {
    if(!Environment.USE_DOCKER_PYTHON) {
        return path.resolve(filePath)
    }
  const resolved = filePath;
  return resolved
    .replace(/^([A-Za-z]):/, (_, driveLetter) => `/${driveLetter.toLowerCase()}`)
    .replace(/\\/g, '/');
}