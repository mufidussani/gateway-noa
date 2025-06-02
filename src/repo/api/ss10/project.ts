import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS10_URL = process.env.SS10_URL || "";

const BASE_PATH = "project";

const API_KEY = process.env.API_KEY_SS10 || "";

let currentLogFileName = createLogFile("service-ss10-project");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getListByIdClient(id_client: number) {
  try {
    const url = `${SS10_URL}${BASE_PATH}/${id_client}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Getlist project";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err) {
    logFormat.message = "Error Getlist project";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
