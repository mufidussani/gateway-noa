import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS01_URL = process.env.SS01_URL || "";

const BASE_PATH = "working";

const API_KEY = process.env.API_KEY_SS01 || "";

let currentLogFileName = createLogFile("service-ss01-working");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIDAreaDate(id_area: number, date: string) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/area-date/${id_area}?date=${date}`;
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Working By ID Area Date";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Working By ID Area Date";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByIDArea(
  searchValue: string,
  limit: number,
  offset: number,
  id_area: number
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/area/${id_area}?search=${searchValue}&limit=${limit}&offset=${offset}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Working By ID Area";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Working By ID Area";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByIDAreaDateIDManpower(
  id_area: number,
  date: string,
  id_manpower: string
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/area-date-manpower/${id_area}/${id_manpower}?date=${date}`;
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Working By ID Area Date & ID Manpower";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Working By ID Area Date & ID Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getDailyByIDAreaIDAgent(
  id_area: number,
  id_user: string
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/area-daily-agent/${id_area}?agent=${id_user}`;
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Working Daily";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Working Daily";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getHistoryDailyByIDAreaIDAgent(
  id_area: number,
  id_user: string,
  start_date: string,
  end_date: string
) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/history-area-daily-agent/${id_area}?agent=${id_user}&start_date=${start_date}&end_date=${end_date}`;
    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get History Working Daily";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get History Working Daily";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
