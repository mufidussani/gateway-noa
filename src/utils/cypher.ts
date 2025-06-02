//Checking the crypto module
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.scryptSync(
  "601aaa46a8a24b57d8aaa418c97d32210b4b042b0fb3d3e735f6a18a0a133e30",
  "GfG",
  32
);
const iv = crypto.scryptSync("b4171eda641e82e97e21604da77a844b", "GFG", 16);
//Encrypting text
function encrypt(text: string) {
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

// Decrypting text
function decrypt(text: string) {
  //   let iv = Buffer.from(iv, "hex");
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    Buffer.from(iv)
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Text send to encrypt function

export { encrypt, decrypt };
