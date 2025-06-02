import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const PRESENCE_URL = process.env.PRESENCE_URL || "";

const BASE_PATH = "presence";

const API_KEY = process.env.API_KEY_PRESENCE || "";

let currentLogFileName = createLogFile("service-presence");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIDManpowerToday(idManpower: string) {
  try {
    const url = `${PRESENCE_URL}${BASE_PATH}/manpower-today/${idManpower}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Presence Today By IDManpower";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Presence Today By IDManpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getManpowerDateRange(idManpower: string, startDate: string, endDate: string) {
  try {
    const url = `${PRESENCE_URL}${BASE_PATH}/manpower-date/${idManpower}?start_date=${startDate}&end_date=${endDate}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Date Range By IDManpower";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Date Range By IDManpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
export async function getByIDProject(id_project: number) {
  try {
    const url = `${PRESENCE_URL}${BASE_PATH}/project/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Presence By IDProject";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Presence By IDProject";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByIDProjectDateRange(id_project: number, startDate: string, endDate: string) {
  const url = `${PRESENCE_URL}${BASE_PATH}/project-date/${id_project}?start_date=${startDate}&end_date=${endDate}`;

  try{

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Presence By ID Project & Date Range";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  }catch(err:any){
    logFormat.message = `Error Get Presence By ID Project & Date Range ${url}`;
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
  
}


