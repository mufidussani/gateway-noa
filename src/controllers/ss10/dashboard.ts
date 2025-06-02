import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as DashboardAPIRepo from "../../repo/api/ss10/dashboard";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";
import { convertDateToString, isValidDate } from "../../utils/dateConvert";

let currentLogFileName = createLogFile("ss10-dashboard");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const date = new Date();

const trx_type = "DASHBOARD";

let empty_check = [null, "", undefined];

export async function getTotalDataByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetDashboard By ID Project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var start_date = req.query.start_date as string;
    var end_date = req.query.end_date as string;

    const dfStartDate = new Date(start_date);
    const dfEndDate = new Date(end_date);

    if (isNaN(dfStartDate.getTime())) {
      throw new Error("Wrong Start Date Format");
    }

    if (isNaN(dfEndDate.getTime())) {
      throw new Error("Wrong End Date Format");
    }

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataDashboard = await DashboardAPIRepo.getByIDProject(
      id_project,
      start_date,
      end_date
    );

    if (!dataDashboard) {
      throw new Error("Error GetDashboard By ID Project service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: dataDashboard.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GetDashboard By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
