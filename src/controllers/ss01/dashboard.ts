import { Request, Response } from "express";
import * as DashboardAPIRepo from "../../repo/api/ss01/dashboard";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-dashboard");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function getByIDProject(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetDashboard By ID Project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataDasboard = await DashboardAPIRepo.getByIDProject(id_project);

    if (!dataDasboard) {
      throw new Error("Error Get Dashboard By ID Project service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataDasboard.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Dashboard By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByDateRangeIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Dashboard By ID Project Date Range";
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

    const dataDasboard = await DashboardAPIRepo.getByDateRangeIDProject(
      id_project,
      start_date,
      end_date
    );

    if (!dataDasboard) {
      throw new Error(
        "Error Get Dashboard By ID Project Date Range service ss01"
      );
    }

    return res.status(200).json({
      message: "Success",
      data: dataDasboard.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Dashboard By ID Project Date Range";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getRankBADByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Dashboard Rank BAD By ID Project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataBAD = await DashboardAPIRepo.getRankBADByIDProject(id_project);

    if (!dataBAD) {
      throw new Error("Error Get Dashboard By ID Project service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataBAD.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Dashboard Rank BAD By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getRankGOODByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Dashboard Rank Good By ID Project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataGood = await DashboardAPIRepo.getRankGOODByIDProject(id_project);

    if (!dataGood) {
      throw new Error("Error Get Dashboard By ID Project service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataGood.data.data,
    });

  } catch (err: any) {
    logFormat.message = "Error Get Dashboard Rank Good By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
