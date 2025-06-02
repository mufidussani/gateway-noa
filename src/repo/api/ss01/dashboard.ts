import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS01_URL = process.env.SS01_URL || "";

const BASE_PATH = "dashboard";

const API_KEY = process.env.API_KEY_SS01 || "";

let currentLogFileName = createLogFile("service-ss01-dashboard");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIDProject(id_project: number) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/project/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get By ID Project";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByDateRangeIDProject(
  id_project: number,
  start_date: string,
  end_date: string
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/project-date/${id_project}?start_date=${start_date}&end_date=${end_date}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get By ID Project Date Range";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get By ID Project Date Range";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getRankBADByIDProject(id_project: number) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/rank-subarea/bad/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Rank BAD";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Rank BAD";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getRankGOODByIDProject(id_project: number) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/rank-subarea/good/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Rank BAD";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Rank Good";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
