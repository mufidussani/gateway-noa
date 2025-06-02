const crypto = require("crypto");

const staticSalt =
  "84e39c9ac3c7d9564ff1e05143e9a2e9f976c37aabe2e1ee305aa8442a4ff8a3"; // Ganti dengan salt yang Anda inginkan

function hashPassword(password: string) {
  const hash = crypto.createHash("md5");
  const passwordSalt = password + staticSalt;
  hash.update(passwordSalt);
  return hash.digest("hex");
}

export { hashPassword };
