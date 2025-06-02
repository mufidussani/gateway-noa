import fs from "fs";
import path from "path";
import {
  convertOrdinalToDatetime,
  formatDateTime,
  formatDate,
} from "./dateConvert";

require("dotenv").config();

function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createLogFile(nameFile: string): string {
  const logDirectory = path.join(
    "/",
    process.env.baseLocation!,
    process.env.projectLocation!,
    process.env.logLocation!
  );
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  const currentDate = getCurrentDateString();
  const logFileName = path.join(logDirectory, `log_${nameFile}.txt`);
  return logFileName;
}

function writeLogToFile(logMessage: string, logFileName: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${formatDateTime(timestamp)}] ${logMessage}\n`;

  fs.appendFile(logFileName, logEntry, (err) => {
    if (err) {
      console.error(`Error writing to ${logFileName}: ${err}`);
    } else {
      console.log(`Log entry written to ${logFileName}: ${logEntry}`);
    }
  });
}

function backupLogFile(nameFile: string) {
  const logDirectory = path.join(
    "/",
    process.env.baseLocation!,
    process.env.projectLocation!,
    process.env.logLocation!
  );
  const currentDate = getCurrentDateString();

  let oldFileName: string = `log_${nameFile}.txt`;
  let newFileName: string = `${currentDate}_log_${nameFile}.txt`;
  fs.rename(
    path.join(logDirectory, oldFileName),
    path.join(logDirectory, newFileName),
    (err) => {
      if (err) {
        console.error(`Gagal mengganti nama file: ${err}`);
      } else {
        console.log("File berhasil diubah nama.");
      }
    }
  );
}

export { writeLogToFile, createLogFile, backupLogFile };

// const logInterval = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik
// let currentLogFileName = createLogFile();

// // Buat file log baru setiap 24 jam
// setInterval(() => {
//   const newLogFileName = createLogFile();
//   if (currentLogFileName !== newLogFileName) {
//     currentLogFileName = newLogFileName;
//   }
// }, logInterval);

// const messageToLog = "Ini adalah pesan log pertama.";

// writeLogToFile(messageToLog, currentLogFileName);
