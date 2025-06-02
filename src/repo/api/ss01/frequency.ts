import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS01_URL = process.env.SS01_URL || "";

const BASE_PATH = "frequency";

const API_KEY = process.env.API_KEY_SS01 || "";

let currentLogFileName = createLogFile("service-ss01-frequency");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getAll(
  searchValue: string,
  limit: number,
  offset: number
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}?search=${searchValue}&limit=${limit}&offset=${offset}`;
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Frequency All";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Frequency All";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
