import { Request, Response } from "express";
import * as TaskAPIRepo from "../../repo/api/ss01/task";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-task");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "TASK";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function getByIDWorking(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_working) {
      logFormat.message = "Error Get Task By ID Working";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_working = req.params.id_working;

    const listTask = await TaskAPIRepo.getByIDWorking(id_working);

    if (!listTask) {
      throw new Error("Error Get List Task By ID Working");
    }

    return res.status(200).json({
      message: "Success",
      data: listTask.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Task By ID Working";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateManpowerByID(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "UPDATE-MANPOWER-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Manpower By ID";
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
      logFormat.message = "Error Update Manpower By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_manpower = req.body.id_manpower;
    const id = req.params.id;
    const id_user = verify.id;

    let data = {
      id_manpower: id_manpower,
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Manpower By Id";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Manpower By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateStatusByID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-STATUS-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Status By ID";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var authorization = req.headers.authorization;

    var flag_manpower = req.headers.flag_manpower as string;

    var token = authorization?.split(" ")[1];

    var numFlagManpower = parseFloat(flag_manpower);

    var verify: any;

    if (numFlagManpower == 0) {
      verify = TokenHandler.verifyToken(token!);
    } else {
      verify = TokenHandlerManpower.verifyToken(token!);
    }

    if (!verify) {
      logFormat.message = "Error Update Status By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_status = req.body.status;
    const id = req.params.id;
    const id_user = verify.id;

    let data = {
      id: id,
      id_status: id_status,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Status By Id";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Status By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByID(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id) {
      logFormat.message = "Error Get Task By ID";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id = req.params.id;

    const detailTask = await TaskAPIRepo.getByID(id);

    if (!detailTask) {
      throw new Error("Error get detail task service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: detailTask.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Task By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateByID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-BY-ID";

  try {
    if (!req.params.id) {
      logFormat.message = "Error Update By ID";
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
      logFormat.message = "Error Update By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const id_user = verify.id;

    let startDateDf = new Date(start_date);
    let endDateDf = new Date(end_date);

    if (isNaN(startDateDf.getTime())) {
      throw new Error("Wrong start date format");
    }

    if (isNaN(endDateDf.getTime())) {
      throw new Error("Wrong end date format");
    }

    let data = {
      id: id,
      start_date: start_date,
      end_date: end_date,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Manpower Id";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
