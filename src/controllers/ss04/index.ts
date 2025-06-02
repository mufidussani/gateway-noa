import { Request, Response } from "express";
import * as SS04APIRepo from "../../repo/api/ss04";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as Redis from "../../repo/redis/ss04/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss04");

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

    if (path === "") {
      throw new Error("empty url request get service-ss04");
    }

    const response = await SS04APIRepo.get(path);

    if (!response) {
      throw new Error(`Error get data service ss04 path : ${path}`);
    }

    return res.status(200).json({
      message: "Success",
      data: response.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Data SS04";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function post(req: Request, res: Response, next: any) {
  try {
    
  } catch (err: any) {
    logFormat.message = "Error Post Data SS04";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
