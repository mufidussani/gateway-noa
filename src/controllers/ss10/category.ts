import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as CategoryAPIRepo from "../../repo/api/ss10/category";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss10/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss10-category");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "CATEGORY";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Category";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const category = req.body.category;
    const id_user = verify.id;

    let data = {
      category: category,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Category";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Category";
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
    var limitReq = req.query.limit as string;
    var offsetReq = req.query.offset as string;

    if (empty_check.includes(searchValue)) {
      searchValue = "";
    }

    if (empty_check.includes(limitReq)) {
      limitReq = "10";
    }

    if (empty_check.includes(offsetReq)) {
      offsetReq = "0";
    }

    var limit = parseFloat(limitReq);

    var offset = parseFloat(offsetReq);

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    const dataCategory = await CategoryAPIRepo.getAll(
      searchValue,
      limit,
      offset
    );

    if (!dataCategory) {
      throw new Error("Error GetCategory All service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: dataCategory.data.data,
      total: dataCategory.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error GeCategory All";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListAll(req: Request, res: Response, next: any) {
  try {
    const listCategory = await CategoryAPIRepo.getListAll();

    if (!listCategory) {
      throw new Error("Error GetCategory List All service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: listCategory.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GeCategory All";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
