import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS10_URL = process.env.SS10_URL || "";

const BASE_PATH = "dashboard";

const API_KEY = process.env.API_KEY_SS10 || "";

let currentLogFileName = createLogFile("service-ss10-dashboard");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIDProject(
  id_project: number,
  start_date: string,
  end_date: string
) {
  try {
    const url = `${SS10_URL}${BASE_PATH}/project/${id_project}?start_date=${start_date}&end_date=${end_date}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success GetDashboard By ID Project";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error GetDashboard By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
