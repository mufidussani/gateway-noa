import { Request, Response } from "express";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as Redis from "../../repo/redis/ss01/stream";
import * as ComplainAPIRepo from "../../repo/api/ss01/complain";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-complain");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "COMPLAIN";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Create Sca";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_subarea = req.body.id_subarea;
    const image = req.body.image;
    const complain = req.body.complain;
    const id_material = req.body.id_material;
    const id_user = verify.id;

    let data = {
      id_subarea: id_subarea,
      image: image,
      complain: complain,
      id_material: id_material,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Complain";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Complain";
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

    const dataComplainAll = await ComplainAPIRepo.getAll(
      searchValue,
      limit,
      offset
    );

    if (!dataComplainAll) {
      throw new Error("Error GetComplain service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataComplainAll.data.data,
      total: dataComplainAll.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error GetComplain";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateSolvedByID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-SOLVE-BY-ID";

  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Complain";
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
      logFormat.message = "Error Update Complain";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const detail_tindak_lanjut = req.body.detail_tindak_lanjut;
    const image_tindak_lanjut = req.body.image_tindak_lanjut;
    const action_by = req.body.action_by;
    const id = req.params.id;
    const id_user = verify.id;

    let data = {
      detail_tindak_lanjut: detail_tindak_lanjut,
      image_tindak_lanjut: image_tindak_lanjut,
      action_by: action_by,
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Complain";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Complain";
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
      logFormat.message = "Error GetComplain By ID";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id = req.params.id;

    const detailComplain = await ComplainAPIRepo.getByID(id);

    if (!detailComplain) {
      throw new Error("Error GetComplain By ID service sss01");
    }

    return res.status(200).json({
      message: "Success",
      data: detailComplain.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GetComplain By ID";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDSubarea(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_subarea) {
      logFormat.message = "Error Get Complain By ID Subarea";
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

    let id_subarea = parseFloat(req.params.id_subarea);

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    if (isNaN(id_subarea)) {
      throw new Error("wrong id subarea");
    }

    const dataComplain = await ComplainAPIRepo.getByIDSubarea(
      searchValue,
      limit,
      offset,
      id_subarea
    );

    if (!dataComplain) {
      throw new Error("Error GetComplain service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataComplain.data.data,
      total: dataComplain.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Complain By ID Subarea";
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
      logFormat.message = "Error Get Complain By ID Project";
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

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    if (isNaN(id_project)) {
      throw new Error("wrong id project");
    }

    const dataComplain = await ComplainAPIRepo.getByIDProject(
      searchValue,
      limit,
      offset,
      id_project
    );

    if (!dataComplain) {
      throw new Error("Error GetComplain service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataComplain.data.data,
      total: dataComplain.data.total,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Complain By ID Project";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateActionByID(req: Request, res: Response, next: any) {
  const sub_type = "UPDATE-ACTION-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Complain";
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
      logFormat.message = "Error Create Complain";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const desc = req.body.desc;
    const id_shift = req.body.id_shift;
    const duration = req.body.duration;
    const id_frequency = req.body.id_frequency;
    const init_date = req.body.init_date;
    const id_user = verify.id;
    const id_manpower = req.body.id_manpower;

    let dfInitDate = new Date(init_date);

    if (isNaN(dfInitDate.getTime())) {
      throw new Error("Error init date");
    }

    let data = {
      id: id,
      desc: desc,
      id_shift: id_shift,
      duration: duration,
      id_frequency: id_frequency,
      init_date: init_date,
      id_manpower: id_manpower,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Complain";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update Complain Acation By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getActionByID(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id) {
      logFormat.message = "Error GetComplain Action By ID";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id = req.params.id;

    const dataComplain = await ComplainAPIRepo.getActionByID(id);

    if (!dataComplain) {
      throw new Error("Error GetComplain Action By ID service sss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataComplain.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Complain Action By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
