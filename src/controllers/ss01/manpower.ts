import { Request, Response } from "express";
import * as ManpowerAPIRepo from "../../repo/api/ss01/manpower";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-manpower");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "MANPOWER";

require("dotenv").config();

const TOPIC = process.env.TOPIC_SS01 || "";

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
      logFormat.message = "Error Create Manpower";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const nip = req.body.nip;
    const name = req.body.name;
    const id_project = req.body.id_project;
    const id_user = verify.id;
    const no_hp = req.body.no_hp;

    let data = {
      nip: nip,
      name: name,
      no_hp: no_hp,
      id_project: id_project,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Manpower";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Create Manpower";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDProject(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error GetManpower By Id Project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
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

    const dataManpower = await ManpowerAPIRepo.getByIDProject(
      searchValue,
      limit,
      offset,
      id_project
    );

    if (!dataManpower) {
      throw new Error("Error GetManpower By Id Project service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataManpower.data.data,
      total: dataManpower.data.total,
    });
  } catch (err) {
    logFormat.message = "Error GetManpower By Id Project";
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
      logFormat.message = "Error GetManpower By Id";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    const detailManpower = await ManpowerAPIRepo.getByID(req.params.id);

    if (!detailManpower) {
      throw new Error("Error GetManpower By Id service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: detailManpower.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GetManpower By Id";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateNoHpByID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-NOHP-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update No HP Manpower";
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
      logFormat.message = "Error Update No HP Manpower";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const no_hp = req.body.no_hp;
    const id_user = verify.id;

    let data = {
      id: id,
      no_hp: no_hp,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update No HP Manpower";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update No HP Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

//SERVICE UPDATE NIP
export async function updateNIPbyID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-NIP-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update NIP Manpower";
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
      logFormat.message = "Error Update NIP";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const nip = req.body.nip;
    const id_user = verify.id;

    let data = {
      id: id,
      nip: nip,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update NIP";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update NIP";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

//UPDATE PROJECT BY ID
export async function updateProjectById(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "UPDATE-MANPOWER-PROJECT-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Project by id";
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
      logFormat.message = "Error Update Project by id";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const id_project = req.body.id_project;
    const id_user = verify.id;

    let data = {
      id_project: id_project,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Project id";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Update On Progress",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
