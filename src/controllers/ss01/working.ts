import { Request, Response } from "express";
import * as WorkingAPIRepo from "../../repo/api/ss01/working";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as WorkingDBRepo from "../../repo/database/working";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-working");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "WORKING";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Working";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const desc = req.body.desc;
    const id_shift = req.body.id_shift;
    const id_subarea = req.body.id_subarea;
    const duration = req.body.duration;
    const id_frequency = req.body.id_frequency;
    const init_date = req.body.init_date;
    const id_user = verify.id;
    const id_type = req.body.id_type;
    const end_date = req.body.end_date;

    const dfInitDate = new Date(init_date);

    if (isNaN(dfInitDate.getTime())) {
      throw new Error("Invalid init_date Format");
    }

    if (!empty_check.includes(end_date)) {
      const dfEndDate = new Date(end_date);

      if (isNaN(dfEndDate.getTime())) {
        throw new Error("Invalid end_date Format");
      }
    }

    let data = {
      desc: desc,
      id_shift: id_shift,
      id_subarea: id_subarea,
      duration: duration,
      id_frequency: id_frequency,
      init_date: init_date,
      id_type: id_type,
      end_date: end_date,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Working";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Working";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDAreaDate(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error Get Working By IdArea Date";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    var date = req.query.date as string;

    const dfDate = new Date(date);

    if (isNaN(dfDate.getTime())) {
      throw new Error("Wrong date format");
    }

    const listWorking = await WorkingAPIRepo.getByIDAreaDate(id_area, date);

    if (!listWorking) {
      throw new Error("Error Get List Working By IDArea Date service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listWorking.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Working By IdArea Date";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDArea(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error Get Working By IdArea";
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

    const listWorking = await WorkingAPIRepo.getByIDArea(
      searchValue,
      limit,
      offset,
      id_area
    );

    if (!listWorking) {
      throw new Error("Error GetWorking By IdArea service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listWorking.data.data,
      total: listWorking.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Working By IdArea";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDAreaDateIDManpower(
  req: Request,
  res: Response,
  next: any
) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandlerManpower.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Get Working By IdArea Date & ID Manpower";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_manpower = verify.id;

    if (!req.params.id_area) {
      logFormat.message = "Error Get Working By IdArea Date & IdManpower";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    var date = req.query.date as string;

    const dfDate = new Date(date);

    if (isNaN(dfDate.getTime())) {
      throw new Error("Wrong date format");
    }

    const listWorking = await WorkingAPIRepo.getByIDAreaDateIDManpower(
      id_area,
      date,
      id_manpower
    );

    if (!listWorking) {
      throw new Error(
        "Error Get List Working By IDArea Date & IdManpower service ss01"
      );
    }

    return res.status(200).json({
      message: "Success",
      data: listWorking.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Working By IdArea Date & IdManpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function createDaily(req: Request, res: Response, next: any) {
  const sub_type = "CREATE-DAILY";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Working Daily";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_manpower = req.body.id_manpower;
    const id_user = verify.id;

    const id_subarea = parseFloat(req.body.id_subarea);

    if (isNaN(id_subarea)) {
      throw new Error("invalid id_subarea");
    }

    const id_shift = parseFloat(req.body.id_shift);

    if (isNaN(id_shift)) {
      throw new Error("invalid id_shift");
    }

    const dataWorkingToday =
      await WorkingDBRepo.getDailyByIDSubareaIDShiftToday(id_subarea, id_shift);

    if (dataWorkingToday.length > 0) {
      throw new Error("Unable to create working daily");
    }

    let data = {
      id_subarea: id_subarea,
      id_shift: id_shift,
      id_manpower: id_manpower,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Working Daily";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Working Daily";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getDailyByIDAreaIDAgent(
  req: Request,
  res: Response,
  next: any
) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Get Working Daily";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!req.params.id_area) {
      logFormat.message = "Error Get Working Daily";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    const id_user = verify.id;

    const dataWorkingDaily = await WorkingAPIRepo.getDailyByIDAreaIDAgent(
      id_area,
      id_user
    );

    if (!dataWorkingDaily) {
      throw new Error("Error Get List Working Daily service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataWorkingDaily.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Working Daily";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getHistoryDailyByIDAreaIDAgent(
  req: Request,
  res: Response,
  next: any
) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Get History Working Daily";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!req.params.id_area) {
      logFormat.message = "Error Get Working Daily";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var start_date = req.query.start_date as string;
    var end_date = req.query.end_date as string;

    const dfStartDate = new Date(start_date);
    const dfEndDate = new Date(end_date);

    if (isNaN(dfStartDate.getTime())) {
      throw new Error("Wrong Start Date Format");
    }

    if (isNaN(dfEndDate.getTime())) {
      throw new Error("Wrong End Date Format");
    }

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id_area");
    }

    const id_user = verify.id;

    const dataWorkingDaily =
      await WorkingAPIRepo.getHistoryDailyByIDAreaIDAgent(
        id_area,
        id_user,
        start_date,
        end_date
      );

    if (!dataWorkingDaily) {
      throw new Error("Error Get List Working Daily service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataWorkingDaily.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get History Working Daily";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
