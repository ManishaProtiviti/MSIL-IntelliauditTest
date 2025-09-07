import { execSync } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";

const isWindows = os.platform() === "win32";
const envDir = path.join(process.cwd(), "scripts", "venv");

// Step 1: Check if virtual environment exists
if (fs.existsSync(envDir)) {
  console.log("Virtual environment already exists at:", envDir);
} else {
  console.log("Creating Python virtual environment...");
  execSync(`python -m venv "${envDir}"`, { stdio: "inherit" });
}

const pipPath = isWindows
  ? path.join(envDir, "Scripts", "pip.exe")
  : path.join(envDir, "bin", "pip");

// Check if requirements.txt exists
const requirementsPath = path.join(
  process.cwd(),
  "scripts",
  "requirements.txt"
);
if (!fs.existsSync(requirementsPath)) {
  console.error("requirements.txt not found.");
} else {
  try {
    console.log("Installing Python packages into virtual environment...");
    execSync(`"${pipPath}" install -r "${requirementsPath}"`, {
      stdio: "inherit",
    });
    console.log("✅ Packages installed successfully.");
  } catch (err) {
    console.error("❌ Failed to install Python packages:", err.message);
    process.exit(1);
  }
}
