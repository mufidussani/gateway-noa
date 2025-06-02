import { Request, Response } from "express";
import * as ClientAPIRepo from "../../repo/api/ss01/client";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-client");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

let empty_check = [null, "", undefined];

export async function getAllList(req: Request, res: Response, next: any) {
  try {
    var searchValue = req.query.search as string;

    if (empty_check.includes(searchValue)) {
      searchValue = "";
    }

    const listClient = await ClientAPIRepo.getAllList(searchValue);

    if (!listClient) {
      throw new Error("Error Get List Client service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listClient.data.data,
    });
  } catch (err) {
    logFormat.message = "Error Getlist Client";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
