import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../utils/logger";

const WA_URL = process.env.WA_API_URL||"";

const WA_API_KEY = process.env.WA_API_KEY;

let currentLogFileName = createLogFile("service-wa-api");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function pushWa(no_hp: string, message: string) {
  try {
    const url:string = WA_URL;

    let config: any = {
      headers: {
        "API-Key": WA_API_KEY,
        "Content-Type": "application/json",
      },
    };

    let body: any = {
      message: message,
      target: no_hp + "@c.us",
    };

    const response = await axios.post(url, body, config);

    logFormat.message = "Success Send WA";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response
  } catch (err: any) {
    logFormat.message = "Error Send WA";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
