import { Request, Response } from "express";
import * as AreaAPIRepo from "../../repo/api/ss01/area";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-area");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "AREA";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Area";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const area = req.body.area;
    const id_projectReq = req.body.id_project;
    const id_user = verify.id;

    let id_project: number = parseFloat(id_projectReq);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    let data = {
      area: area,
      id_project: id_project,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Area";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Create Area";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIdProject(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetArea By IdProject";
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

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataArea = await AreaAPIRepo.getByIdProject(
      searchValue,
      limit,
      offset,
      id_project
    );

    if (!dataArea) {
      throw new Error("Error GetArea By IdProject service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataArea.data.data,
      total:dataArea.data.total
    });
  } catch (err) {
    logFormat.message = "Error GetArea By IdProject";
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
      logFormat.message = "Error GetArea By Id";
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

    const detailArea = await AreaAPIRepo.getByID(id);

    if (!detailArea) {
      throw new Error("Error GetArea By Id service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: detailArea.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GeArea By Id";
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
      logFormat.message = "Error Update Area By Id";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!req.params.id) {
      logFormat.message = "Error Update Area By Id";
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

    const area = req.body.area;
    const id_projectReq = req.body.id_project;
    const id_user = verify.id;

    let id_project: number = parseFloat(id_projectReq);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    let data = {
      area: area,
      id_project: id_project,
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Area By Id";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Update Area By Id";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListByIdProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetListArea By IdProject";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    const id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const listArea = await AreaAPIRepo.getListByIdProject(id_project);

    if (!listArea) {
      throw new Error("Error GetListArea By IdProject service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listArea.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GetListArea By IdProject";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
