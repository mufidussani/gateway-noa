import axios from "axios";

require("dotenv").config();

import { writeLogToFile, createLogFile } from "../../../utils/logger";

const FEEDBACK_URL = process.env.FEEDBACK_URL || "";

const BASE_PATH = "feedback";

const API_KEY = process.env.API_KEY_FEEDBACK || "";

let currentLogFileName = createLogFile("service-feedback");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export async function getTotalByIDProject(id_project: number) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/total-list/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get All List Total Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get All List Total Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getGraphYearNowByIDProject(id_project: number) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/graph-year/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Graph Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Graph Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getAreaByIDProject(id_project: number) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/area-list/${id_project}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Area Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Area Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getSubareaByIDArea(id_area: number) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/subarea-list/${id_area}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Subarea Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Subarea Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getByIDProject(
  id_project: number,
  start_date: string,
  end_date: string
) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/project/${id_project}?start_date=${start_date}&end_date=${end_date}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getGraphBadByMonthByIDProject(
  id_project: number,
  month: number
) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/graph-month/${id_project}?month=${month}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Graph Bad By IDProject Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Graph Bad By IDProject Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}

export async function getGraphBadByMonthByIDSubarea(
  id_subarea: number,
  month: number
) {
  try {
    const url = `${FEEDBACK_URL}${BASE_PATH}/graph-month-subarea/${id_subarea}?month=${month}`;

    let config: any = {
      headers: {
        "api-key": API_KEY,
      },
    };

    const response = await axios.get(url, config);

    logFormat.message = "Success Get Graph Bad By IDSubarea Feedback";
    logFormat.status = response.status;
    logFormat.data = response.data;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);

    return response;
  } catch (err: any) {
    logFormat.message = "Error Get Graph Bad By IDSubarea Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return false;
  }
}
