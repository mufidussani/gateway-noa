import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as QuestionAPIRepo from "../../repo/api/ss01/question";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-question");

const logFormat: any = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "QUESTION";

require("dotenv").config();


let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Question";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_subareaReq = req.body.id_subarea;
    const id_material = req.body.id_material;
    const id_user = verify.id;

    let id_subarea: number = parseFloat(id_subareaReq);

    if (isNaN(id_subarea)) {
      throw new Error("");
    }

    if (!Array.isArray(id_material)) {
      throw new Error("wrong type id_material");
    }

    if (id_material.length <= 0) {
      throw new Error("empty id_material");
    }

    let data = {
      id_subarea: id_subarea,
      id_material: id_material,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Question";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Create Question";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getMaterialByIDSubarea(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_subarea) {
      logFormat.message = "Error GetMaterialQuestion By IdSubarea";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_subarea: number = parseFloat(req.params.id_subarea);

    if (isNaN(id_subarea)) {
      throw new Error("wrong type id_subarea");
    }

    const dataMaterial = await QuestionAPIRepo.getMaterialByIdSubarea(
      id_subarea
    );

    if (!dataMaterial) {
      throw new Error("Error GetMaterialQuestion By Id Subarea ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataMaterial.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GetMaterialQuestion By IdSubarea";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
