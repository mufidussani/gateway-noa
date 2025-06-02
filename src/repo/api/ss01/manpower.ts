import axios from "axios";
require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS01_URL = process.env.SS01_URL || "";

const BASE_PATH = "manpower";

const API_KEY = process.env.API_KEY_SS01 || "";

let currentLogFileName = createLogFile("service-ss01-manpower");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIDProject(
  searchValue: string,
  limit: number,
  offset: number,
  id_project: number
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/project/${id_project}?search=${searchValue}&limit=${limit}&offset=${offset}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success GetManpower By ID Project";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err) {
    logFormat.message = "Error GetManpower By ID Project";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByID(id: string) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/${id}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success GetManpower By ID";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err) {
    logFormat.message = "Error GetManpower By ID";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

