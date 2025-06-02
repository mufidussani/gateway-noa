import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const TRAINING_URL = process.env.TRAINING_URL || "";

const API_KEY = process.env.API_KEY_TRAINING || "";

let currentLogFileName = createLogFile("service-training");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function get(path: string) {
  const url = `${TRAINING_URL}${path}`;

  try {
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Data training";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = `Error Get Data training url : ${url}`;
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
