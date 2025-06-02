import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const FEEDBACK_URL = process.env.FEEDBACK_URL || "";

const BASE_PATH = "feedback";

const API_KEY = process.env.API_KEY_FEEDBACK || "";

let currentLogFileName = createLogFile("service-ss01-material-feedback");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getListAll() {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/material-list`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get All List Material Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get All List Material Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
