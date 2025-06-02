const jwt = require("jsonwebtoken");
// const zlib = require('zlib')
import { encrypt, decrypt } from "./cypher";

require("dotenv").config();

const secretKey: any = process.env.secretkeyM;

function generateToken(payload: any): string {
  var token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  var encToken = encrypt(token);
  return encToken;
}

function verifyToken(token: string): any {
  try {
    var decrToken = decrypt(token);
    return jwt.verify(decrToken, secretKey);
  } catch (err) {
    return null;
  }
}

function generateTokenPWD(payload: any): string {
  var token = jwt.sign(payload, secretKey, { expiresIn: "5m" });
  var encToken = encrypt(token);
  return encToken;
}

function verifyTokenPWD(token: string): any {
  try {
    var decrToken = decrypt(token);
    return jwt.verify(decrToken, secretKey);
  } catch (err) {
    return null;
  }
}

function generateTokenFeedBack(payload: any): string {
  var token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  var encToken = encrypt(token);
  return encToken;
}

function verifyTokenFeedBack(token: string): any {
  try {
    var decrToken = decrypt(token);
    return jwt.verify(decrToken, secretKey);
  } catch (err) {
    return null;
  }
}

export {
  generateToken,
  verifyToken,
  generateTokenPWD,
  verifyTokenPWD,
  generateTokenFeedBack,
  verifyTokenFeedBack,
};
