import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS10_URL = process.env.SS10_URL || "";

const BASE_PATH = "subarea";

const API_KEY = process.env.API_KEY_SS10 || "";

let currentLogFileName = createLogFile("service-ss10-area");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIdArea(
  searchValue: string,
  limit: number,
  offset: number,
  id_area: number
) {
  try {
    const url = `${SS10_URL}${BASE_PATH}/area/${id_area}?search=${searchValue}&limit=${limit}&offset=${offset}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Subarea By IdArea";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err) {
    logFormat.message = "Error Get Subarea By IdArea";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByID(id: number) {
  try {
    const url = `${SS10_URL}${BASE_PATH}/${id}`;
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Subarea By Id";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;

  } catch (err) {
    logFormat.message = "Error Get Subarea By Id";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
