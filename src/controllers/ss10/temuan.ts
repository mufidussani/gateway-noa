import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as TemuanAPIRepo from "../../repo/api/ss10/temuan";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss10/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";
import { convertDateToString, isValidDate } from "../../utils/dateConvert";

let currentLogFileName = createLogFile("ss10-temuan");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const date = new Date();

const trx_type = "TEMUAN";

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Temuan";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const tag = req.body.tag;
    const desc = req.body.desc;
    const image = req.body.image;
    const id_user = verify.id;

    let data = {
      tag: tag,
      desc: desc,
      image: image,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Temuan";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Temuan";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDClient(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_client) {
      logFormat.message = "Error GetTemuan By ID Client";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var searchValue = req.query.search as string;
    var limitReq = req.query.limit as string;
    var offsetReq = req.query.offset as string;
    var startDate = req.query.start_date as string;
    var endDate = req.query.end_date as string;

    if (empty_check.includes(searchValue)) {
      searchValue = "";
    }

    if (empty_check.includes(limitReq)) {
      limitReq = "10";
    }

    if (empty_check.includes(offsetReq)) {
      offsetReq = "0";
    }

    if (empty_check.includes(startDate)) {
      startDate = convertDateToString(date);
    }

    if (empty_check.includes(endDate)) {
      endDate = convertDateToString(date);
    }

    if (!isValidDate(startDate)) {
      throw new Error("Invalid Start Date format");
    }

    if (!isValidDate(endDate)) {
      throw new Error("Invalid End Date format");
    }

    let startDate_date = new Date(startDate);
    let endDate_date = new Date(endDate);

    if (startDate_date > endDate_date) {
      throw new Error("Invalid Date Input");
    }

    var limit = parseFloat(limitReq);

    var offset = parseFloat(offsetReq);

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    var id_client: number = parseFloat(req.params.id_client);

    if (isNaN(id_client)) {
      throw new Error("wrong type id_client");
    }

    const dataTemuan = await TemuanAPIRepo.getByIDClient(
      searchValue,
      limit,
      offset,
      startDate,
      endDate,
      id_client
    );

    if (!dataTemuan) {
      throw new Error("Error GetTemuan By ID Client service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: dataTemuan.data.data,
      total: dataTemuan.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error GetTemuan By ID Client";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDProject(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetTemuan By ID Project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var searchValue = req.query.search as string;
    var limitReq = req.query.limit as string;
    var offsetReq = req.query.offset as string;
    var startDate = req.query.start_date as string;
    var endDate = req.query.end_date as string;

    if (empty_check.includes(searchValue)) {
      searchValue = "";
    }

    if (empty_check.includes(limitReq)) {
      limitReq = "10";
    }

    if (empty_check.includes(offsetReq)) {
      offsetReq = "0";
    }

    if (empty_check.includes(startDate)) {
      startDate = convertDateToString(date);
    }

    if (empty_check.includes(endDate)) {
      endDate = convertDateToString(date);
    }

    if (!isValidDate(startDate)) {
      throw new Error("Invalid Start Date format");
    }

    if (!isValidDate(endDate)) {
      throw new Error("Invalid End Date format");
    }

    let startDate_date = new Date(startDate);
    let endDate_date = new Date(endDate);

    if (startDate_date > endDate_date) {
      throw new Error("Invalid Date Input");
    }

    var limit = parseFloat(limitReq);

    var offset = parseFloat(offsetReq);

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    var id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataTemuan = await TemuanAPIRepo.getByIDProject(
      searchValue,
      limit,
      offset,
      startDate,
      endDate,
      id_project
    );

    if (!dataTemuan) {
      throw new Error("Error GetTemuan By ID Project service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: dataTemuan.data.data,
      total: dataTemuan.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error GetTemuan By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
