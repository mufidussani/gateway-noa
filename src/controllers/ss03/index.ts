import { Request, Response } from "express";
import * as SS03APIRepo from "../../repo/api/ss03";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as Redis from "../../repo/redis/ss03/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("training");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function get(req: Request, res: Response, next: any) {
  try {
    const path = req.query.path as string;

    if (empty_check.includes(path)) {
      throw new Error("empty url request get service-ss03");
    }

    const response = await SS03APIRepo.get(path);

    if (!response) {
      throw new Error(`Error get data service ss03 path : ${path}`);
    }

    return res.status(200).json({
      message: "Success",
      data: response.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Data SS03";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function post(req: Request, res: Response, next: any) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var flag_manpower = req.headers.flag_manpower as string;

    var verify: any = {};

    const numFlagManpower = parseFloat(flag_manpower);

    if (numFlagManpower == 0) {
      verify = TokenHandler.verifyToken(token!);
    } else if (numFlagManpower == 1) {
      verify = TokenHandlerManpower.verifyToken(token!);
    }

    if (!verify) {
      logFormat.message = "Error post";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const trx_type = req.body.trx_type;
    const sub_type = req.body.sub_type;
    const id_user = verify.id;

    let data = req.body;

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = `Processing trx_type : ${trx_type} sub_type : ${sub_type}`;
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error post";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
