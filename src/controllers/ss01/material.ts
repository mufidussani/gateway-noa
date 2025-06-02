import { Request, Response } from "express";
import * as MaterialAPIRepo from "../../repo/api/ss01/material";
import * as TokenHandler from "../../utils/tokenHandlerUser";
// import * as RabbitUtils from "../../utils/rabbit";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";
import { isDate } from "util/types";

let currentLogFileName = createLogFile("ss01-material");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "MATERIAL";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Material";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const material = req.body.material;
    const standard = req.body.standard;
    const id_user = verify.id;

    let data = {
      material: material,
      standard: standard,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Material";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Create Material";
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

    const dataMaterial = await MaterialAPIRepo.getAll(
      searchValue,
      limit,
      offset
    );

    if (!dataMaterial) {
      throw new Error("Error GetMaterial All service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataMaterial.data.data,
      tota: dataMaterial.data.total,
    });
  } catch (err) {
    logFormat.message = "Error GetMaterial All";
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
      logFormat.message = "Error GetMaterial By ID";
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

    const detailMaterial = await MaterialAPIRepo.getByID(id);

    if (!detailMaterial) {
      throw new Error("Error GetMaterial By Id service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: detailMaterial.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GetMaterial By ID";
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
      logFormat.message = "Error Update Material By Id";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!req.params.id) {
      logFormat.message = "Error Update Material By Id";
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

    const material = req.body.material;
    const standard = req.body.standard;
    const id_user = verify.id;

    let data = {
      material: material,
      standard: standard,
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Material By Id";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Update Material By Id";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function deleteMaterialById(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "DELETE-MATERIAL-BY-ID";
  const trx_type = "delete";

  try {
    if (!req.params.id) {
      logFormat.message = "Error Delete Material by id";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Delete Material By id";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    let id: number = parseFloat(req.params.id);

    if (isNaN(id)) {
      throw new Error("wrong type id");
    }

    const id_user = verify.id;

    let data = {
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    //const Delete = await deleteMaterialFromdB(id);

    logFormat.message = "Processing Delete";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Deleting Material On Process",
    });
  } catch (err) {
    logFormat.message = "Error Delete Material";
    logFormat.status = 500;
    logFormat.data = "Not Found";
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListAll(req: Request, res: Response, next: any) {
  try {
    const dataMaterial = await MaterialAPIRepo.getListAll();

    if (!dataMaterial) {
      throw new Error("Error GetMaterial list All service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataMaterial.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GetMaterial list All";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
