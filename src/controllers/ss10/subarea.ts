import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as SubAreaAPIRepo from "../../repo/api/ss10/subarea";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss10/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss10-subarea");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "SUBAREA";

require("dotenv").config();

const TOPIC = process.env.TOPIC_SS10 || "";

const EXCHANGE = process.env.RABBIT_EXCHANGE_SS01 || "";

const QUEUE = process.env.RABBIT_QUEUE_SS01 || "";

const ROUTE_KEY = process.env.RABBIT_ROUTE_SS01 || "";

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Subarea";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const subarea = req.body.subarea;
    const id_areaReq = req.body.id_area;
    const id_user = verify.id;

    let id_area: number = parseFloat(id_areaReq);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    let data = {
      subarea: subarea,
      id_area: id_area,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Subarea";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Subarea";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIdArea(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error Get Subarea By IdArea";
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

    const dataSubarea = await SubAreaAPIRepo.getByIdArea(
      searchValue,
      limit,
      offset,
      id_area
    );

    if (!dataSubarea) {
      throw new Error("Error GetArea By IdArea service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: dataSubarea.data.data,
      total: dataSubarea.data.total,
    });
  } catch (err) {
    logFormat.message = "Error Get Subarea By IdArea";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByID(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id) {
      logFormat.message = "Error Get Subarea By Id";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id: number = parseFloat(req.params.id);

    if (isNaN(id)) {
      throw new Error("wrong type id");
    }

    const detailSubArea = await SubAreaAPIRepo.getByID(id);

    if (!detailSubArea) {
      throw new Error("Error GetSubarea By Id service ss10");
    }

    return res.status(200).json({
      message: "Success",
      data: detailSubArea.data.data,
    });
  } catch (err) {
    logFormat.message = "Error Get Subarea By Id";
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
      logFormat.message = "Error Update Subarea";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!req.params.id) {
      logFormat.message = "Error Update Subarea";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id: number = parseFloat(req.params.id);

    if (isNaN(id)) {
      throw new Error("Wrong type id");
    }

    const subarea = req.body.subarea;
    const id_tag = req.body.id_tag;
    const id_user = verify.id;

    let data = {
      subarea: subarea,
      id_tag: id_tag,
      id:id
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Subarea";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Subarea";
    logFormat.status = 500;
    logFormat.data = err.message;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function deleteById(req: Request, res: Response, next: any) {
  const sub_type = "DELETE-BY-ID";
  try{
    if(!req.params.id){
      logFormat.message = "Error Delete Subarea by id";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_req: number = parseFloat(req.params.id);

    if (isNaN(id_req)) {
    throw new Error("wrong type id");
    }

    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Delete Subarea";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const subarea = req.body.subarea;
    const id = req.body.id;
    const id_user = verify.id;
    const is_feedback = req.body.is_feedback;

    let data = {
      id_body: id,
      subarea: subarea
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;
    
    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Delete Subarea";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

  return res.status(200).json({
    message: "Success",
    data: "Message On Process",
  });

  } catch(err: any){
    logFormat.message = "Error Delete Subarea";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err,500));
  }

}