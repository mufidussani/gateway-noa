import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as TagAPIRepo from "../../repo/api/ss10/tag";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss10/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss10-tag");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "TAG";

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Tag";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const tag = req.body.tag;
    const id_area = req.body.id_area;
    const id_user = verify.id;

    let data = {
      tag: tag,
      id_area: id_area,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Tag";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Tag";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDArea(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error GetTag By ID Area";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

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

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    const dataTag = await TagAPIRepo.getByIDArea(
      searchValue,
      limit,
      offset,
      id_area
    );

    if (!dataTag) {
      throw new Error("Error GetTag By ID Area service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: dataTag.data.data,
      total: dataTag.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error GetTag By ID Area";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListDeactiveByIDArea(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error GetListTag Deactive By ID Area";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var idReq = req.query.id as string;

    var id: number = parseFloat(idReq);

    if (isNaN(id)) {
      id = 0;
    }

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    const listTagDeActive = await TagAPIRepo.getListDeactiveByIDArea(
      id_area,
      id
    );

    if (!listTagDeActive) {
      throw new Error("Error GetListTag DeActive By ID Area service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: listTagDeActive.data.data,
    });



  } catch (err: any) {
    logFormat.message = "Error GetListTag Deactive By ID Area";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
