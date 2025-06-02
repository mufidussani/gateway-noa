import { Request, Response } from "express";
import AppError from "../../utils/appError";
import * as MaterialFeedbackAPIRepo from "../../repo/api/feedback/material";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("material-feedback");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "MATERIAL_FEEDBACK";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function getListAll(req: Request, res: Response, next: any) {
  try {
    const listMaterial = await MaterialFeedbackAPIRepo.getListAll();

    if (!listMaterial) {
      throw new Error("Error Get List Material service feedback");
    }

    return res.status(200).json({
      message:"Success",
      data:listMaterial.data.data
    })
  } catch (err: any) {
    logFormat.message = "Error Get List Material Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
