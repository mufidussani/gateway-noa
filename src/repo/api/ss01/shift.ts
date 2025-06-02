import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS01_URL = process.env.SS01_URL || "";

const BASE_PATH = "shift";

const API_KEY = process.env.API_KEY_SS01 || "";

let currentLogFileName = createLogFile("service-ss01-shift");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getAll(searchValue:string){
    try {
        const url = `${SS01_URL}${BASE_PATH}?search=${searchValue}`

        let config: any = {
          headers: {
            "api-key": API_KEY,
          },
        };

        const response = await axios.get(url, config);

        logFormat.message = "Success GetShift";
        logFormat.status = response.status;
        logFormat.data = response.data;
        const data_log = JSON.stringify(logFormat);
        writeLogToFile(data_log, currentLogFileName);

        return response;

    } catch (err) {
        logFormat.message = "Error GetShift";
        logFormat.status = 500;
        logFormat.data = err!;
        const data_log = JSON.stringify(logFormat);
        writeLogToFile(data_log, currentLogFileName);
        return false;
    }
}

export async function getListByIDProject(id_project:number) {
  try {
    const url = `${SS01_URL}${BASE_PATH}/list-project/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success GetShift By ID Project";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err:any) {
    logFormat.message = "Error Get Shift By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}