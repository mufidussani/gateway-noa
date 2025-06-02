import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const SS10_URL = process.env.SS10_URL || "";

const BASE_PATH = "tag";

const API_KEY = process.env.API_KEY_SS10 || "";

let currentLogFileName = createLogFile("service-ss10-tag");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getByIDArea(
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

    logFormat.message = "Success GetTag By ID Area";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error GetTag By ID Area";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getListDeactiveByIDArea(id_area:number,id:number) {
    try {
        const url = `${SS10_URL}${BASE_PATH}/list/deactive/area/${id_area}?id=${id}`;

        let config: any = {
          headers: {
            "api-key": API_KEY,
          },
        };

        const response = await axios.get(url, config);

        logFormat.message = "Success GetListTag DeActive By ID Area";
        logFormat.status = response.status;
        logFormat.data = response.data;
        const data_log = JSON.stringify(logFormat);
        writeLogToFile(data_log, currentLogFileName);

        return response;
    } catch (err:any) {
        logFormat.message = "Error GetListTag DeActive By ID Area";
        logFormat.status = 500;
        logFormat.data = err.message;
        const data_log = JSON.stringify(logFormat);
        writeLogToFile(data_log, currentLogFileName);
        return false;
    }
}
