import axios from "axios";
require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS01_URL = process.env.SS01_URL || "";

const BASE_PATH = "material";

const API_KEY = process.env.API_KEY_SS01 || "";

let currentLogFileName = createLogFile("service-ss01-material");

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

    logFormat.message = "Success GetAll Material";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err) {
    logFormat.message = "Error GetAll Material";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByID(id: number) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/${id}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success GetDetail Material";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err) {
    logFormat.message = "Error GetDetail Material";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getListAll() {
  try {
    const url = `${SS01_URL}${BASE_PATH}/list/all`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success GetAll list Material";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err:any) {
    logFormat.message = "Error GetAll list Material";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
