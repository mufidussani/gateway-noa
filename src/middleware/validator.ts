import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { writeLogToFile, createLogFile } from "../utils/logger";

let currentLogFileName = createLogFile("middleware-validator");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

export function Validator(req:Request,res:Response,next:any){
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logFormat.message = "Error Validator";
      logFormat.status = 400;
      logFormat.data = errors.array();
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(400).json({
        message: false,
        errors: errors.array(),
      });
    }

    next()
}