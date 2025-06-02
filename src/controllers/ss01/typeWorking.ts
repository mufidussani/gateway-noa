import { Request, Response } from "express";
import * as TypeWorkingAPIRepo from "../../repo/api/ss01/typeWorking";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-type-working");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function getAll(req: Request, res: Response, next: any) {
  try {
    const listTypeWorking = await TypeWorkingAPIRepo.getAll();

    if (!listTypeWorking) {
      throw new Error("Error Get Type Working service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listTypeWorking.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Type Working";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
