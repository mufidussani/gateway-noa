import { Request, Response } from "express";
import * as ProjectAPIRepo from "../../repo/api/ss01/project";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-project");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

let empty_check = [null, "", undefined];

export async function getListByIdClient(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_client) {
      logFormat.message = "Error Getlist project";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_client: number = parseFloat(req.params.id_client);

    if (isNaN(id_client)) {
      throw new Error("wrong type id_client");
    }

    const listProject = await ProjectAPIRepo.getListByIdClient(id_client);

    if (!listProject) {
      throw new Error("Error Get List ProjectByID service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listProject.data.data,
    });
  } catch (err) {
    logFormat.message = "Error Getlist Project";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
