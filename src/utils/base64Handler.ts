const fs = require("fs");
const base64 = require("base64-js");

// Fungsi untuk mengenkripsi berkas ke Base64
function encodeFile(filePath: any) {
  try {
    const fileData = fs.readFileSync(filePath);
    const encodedData = base64.fromByteArray(fileData);
    return encodedData;
  } catch (error) {
    console.error("Gagal membaca berkas:", error);
    return null;
  }
}

// Fungsi untuk mendekripsi Base64 menjadi berkas
function decodeToFile(encodedData: string, outputPath: string) {
  try {
    const decodedData = base64.toByteArray(encodedData);
    fs.writeFileSync(outputPath, decodedData);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { encodeFile, decodeToFile };
