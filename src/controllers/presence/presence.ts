import { Request, Response } from "express";
import * as PresenceAPIRepo from "../../repo/api/presence/presence";
import * as ProjectDBRepo from "../../repo/database/project";
import * as ShiftDBRepo from "../../repo/database/shift";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as Redis from "../../repo/redis/presence/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";
import * as PresenceDBRepo from "../../repo/database/presence";

import * as Hvr from "../../utils/haversine";
import { error } from "console";
import {
  timeStringToUnixTime,
  getCurrentTimeString,
  convertDateToString,
  isValidDate,
} from "../../utils/dateConvert";

let currentLogFileName = createLogFile("presence");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "PRESENCE";

require("dotenv").config();

let empty_check = [null, "", undefined];

var RADIUS: number | string = process.env.RADIUS_PRESENCE || 0;

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandlerManpower.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create presence";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    var Radius: number;

    if (typeof RADIUS === "number") {
      Radius = RADIUS;
    } else {
      Radius = parseFloat(RADIUS);

      if (isNaN(Radius)) {
        throw new Error("Radius presence not set on system");
      }
    }

    const nip = req.body.nip;
    var id_shift = req.body.id_shift;
    const time_in = req.body.time_in;
    const lat_in = req.body.lat_in;
    const lng_in = req.body.lng_in;
    const id_ot = req.body.id_ot;
    const note = req.body.note;
    const id_user = verify.id;

    const geoProject = await ProjectDBRepo.getLatLngByIDManpower(id_user);

    if (geoProject.length <= 0) {
      throw new Error("ID user & Project not set in system presence");
    }

    let projectLat = geoProject[0].lat;
    let projectLng = geoProject[0].lng;

    var distanceUser = Hvr.haversine(lat_in, lng_in, projectLat, projectLng);

    // in meter
    distanceUser = distanceUser * 1000;

    if (distanceUser > Radius) {
      throw new Error(`Forbidden location to presence : ${distanceUser}`);
    }

    id_shift = parseFloat(id_shift);

    const dataShift = await ShiftDBRepo.getByID(id_shift);

    if (dataShift.length < 0) {
      throw new Error("invalid id_shift");
    }

    const startTime = dataShift[0].start;
    const endTime = dataShift[0].end;
    // const timeNow = getCurrentTimeString();

    const timeInUnix = timeStringToUnixTime(time_in);
    const startTimeUnix = timeStringToUnixTime(startTime);
    var endTimeUnix = timeStringToUnixTime(endTime);

    if (startTimeUnix > endTimeUnix) {
      endTimeUnix = endTimeUnix + 24 * 60 * 60;
    }

    if (timeInUnix < startTimeUnix - 2 * 60 * 60) {
      throw new Error("too early to clock in");
    }

    if (timeInUnix > endTimeUnix) {
      throw new Error("forbidden clock in, you are not presence");
    }

    let data = {
      nip: nip,
      id_shift: id_shift,
      time_in: time_in,
      lat_in: lat_in,
      lng_in: lng_in,
      id_ot: id_ot,
      note: note,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Presence";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Presence";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDManpowerToday(
  req: Request,
  res: Response,
  next: any
) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandlerManpower.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create presence";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const dataPresence = await PresenceAPIRepo.getByIDManpowerToday(verify.id);

    if (!dataPresence) {
      throw new Error(
        "Error service presence get Presence Today BY ID Manpower"
      );
    }

    return res.status(200).json({
      message: "Success",
      data: dataPresence.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Presence today By IDManpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateOut(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-OUT";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Out Presence";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandlerManpower.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create presence";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    var Radius: number;

    if (typeof RADIUS === "number") {
      Radius = RADIUS;
    } else {
      Radius = parseFloat(RADIUS);

      if (isNaN(Radius)) {
        throw new Error("Radius presence not set on system");
      }
    }

    const time_out = req.body.time_out;
    const lat_out = req.body.lat_out;
    const lng_out = req.body.lng_out;
    const id = req.params.id;
    const id_user = verify.id;

    const geoProject = await ProjectDBRepo.getLatLngByIDManpower(id_user);

    if (geoProject.length <= 0) {
      throw new Error("ID user & Project not set in system presence");
    }

    let projectLat = geoProject[0].lat;
    let projectLng = geoProject[0].lng;

    var distanceUser = Hvr.haversine(lat_out, lng_out, projectLat, projectLng);

    // in meter
    distanceUser = distanceUser * 1000;

    if (distanceUser > Radius) {
      throw new Error(`Forbidden location to presence : ${distanceUser}`);
    }

    let data = {
      id: id,
      time_out: time_out,
      lat_out: lat_out,
      lng_out: lng_out,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    const dataShift = await PresenceDBRepo.criteriaNotMet(id);
    if (dataShift.length <= 0) {
      throw new Error(`No shift inserted`);
    }

    const endTime = dataShift[0].end;
    const endTimeUnix = timeStringToUnixTime(endTime);
    const timeNow = time_out;
    const timeNowUnix = timeStringToUnixTime(timeNow);

    if (endTimeUnix > timeNowUnix) {
      throw new Error(`Unable clock out`);
    }

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update out Presence";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Out Presence";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDProject(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Presence By IDProject";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("invalid id_project");
    }

    const dataPresence = await PresenceAPIRepo.getByIDProject(id_project);

    if (!dataPresence) {
      throw new Error("Error service presence get Presence BY ID Project");
    }

    return res.status(200).json({
      message: "Success",
      data: dataPresence.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Presence By IDProject";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getManpowerDateRange(
  req: Request,
  res: Response,
  next: any
) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandlerManpower.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Get Presence Manpower by Date Range";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    let limitReq = req.query.limit as string;
    let offsetReq = req.query.offset as string;
    let startDate = req.query.start_date as string;
    let endDate = req.query.end_date as string;
    const empty_check = [null, undefined, ""];

    const dataPresence = await PresenceAPIRepo.getManpowerDateRange(
      verify.id,
      startDate,
      endDate
    );

    if (!dataPresence) {
      throw new Error("Error service presence get Manpower by Date Range");
    }

    if (empty_check.includes(startDate)) {
      startDate = convertDateToString(new Date());
    }
    if (empty_check.includes(endDate)) {
      endDate = convertDateToString(new Date());
    }

    if (!isValidDate(startDate)) {
      throw new Error("Invalid Start Date format");
    }

    if (!isValidDate(endDate)) {
      throw new Error("Invalid End Date format");
    }

    let startDate_date = new Date(startDate);
    let endDate_date = new Date(endDate);

    if (startDate_date > endDate_date) {
      throw new Error("Invalid Date Input");
    }

    return res.status(200).json({
      message: "Success",
      data: dataPresence.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Manpower by Date Range";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDProjectDateRange(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Presence By IDProject Date Range";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("invalid id_project");
    }

    let startDate = req.query.start_date as string;
    let endDate = req.query.end_date as string;

    if (empty_check.includes(startDate)) {
      startDate = convertDateToString(new Date());
    }
    if (empty_check.includes(endDate)) {
      endDate = convertDateToString(new Date());
    }

    if (!isValidDate(startDate)) {
      throw new Error("Invalid Start Date format");
    }

    if (!isValidDate(endDate)) {
      throw new Error("Invalid End Date format");
    }

    let startDate_date = new Date(startDate);
    let endDate_date = new Date(endDate);

    if (startDate_date > endDate_date) {
      throw new Error("Invalid Date Input");
    }

    const dataPresence = await PresenceAPIRepo.getByIDProjectDateRange(
      id_project,
      startDate,
      endDate
    );

    if (!dataPresence) {
      throw new Error("Error service presence get Manpower by Date Range");
    }

    return res.status(200).json({
      message: "Success",
      data: dataPresence.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Presence By IDProject Date Range";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
