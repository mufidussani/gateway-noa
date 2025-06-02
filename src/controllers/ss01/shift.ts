import { Request, Response } from "express";
import * as ShiftAPIRepo from "../../repo/api/ss01/shift";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-shift");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "SHIFT";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Shift";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const shift = req.body.shift;
    const startTime = req.body.start_time;
    const endTime = req.body.end_time;
    const id_project = req.body.id_project;
    const id_user = verify.id;

    let data = {
      shift: shift,
      start_time: startTime,
      end_time: endTime,
      id_project: id_project,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Shift";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Create Shift";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getAll(req: Request, res: Response, next: any) {
  try {
    var searchValue = req.query.search as string;

    if (empty_check.includes(searchValue)) {
      searchValue = "";
    }

    const dataShift = await ShiftAPIRepo.getAll(searchValue);

    if (!dataShift) {
      throw new Error("Error GetShift service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataShift.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GetShift";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateByID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-BY-ID";
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Update Shift";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!req.params.id) {
      logFormat.message = "Error Update Shift";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_shift: number = parseFloat(req.params.id);

    if (isNaN(id_shift)) {
      throw new Error("Wrong type id");
    }

    const id = req.body.id;
    const shift = req.body.shift;
    const startTime = req.body.start_time;
    const endTime = req.body.end_time;
    const id_user = verify.id;

    let data = {
      id: id,
      shift: shift,
      start_time: startTime,
      end_time: endTime,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Shift";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Shift";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetShift By IdProject";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const listShift = await ShiftAPIRepo.getListByIDProject(id_project);

    if (!listShift) {
      throw new Error("Error GetShift By IDProject service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listShift.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GetShift By IdProject";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
