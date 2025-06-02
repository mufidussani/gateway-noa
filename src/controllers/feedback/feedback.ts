import { Request, Response } from "express";
import * as FeedbackAPIRepo from "../../repo/api/feedback/feedback";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as Redis from "../../repo/redis/feedback/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("feedback");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "FEEDBACK";

require("dotenv").config();

let empty_check = [null, "", undefined];

export async function create(req: Request, res: Response, next: any) {
  const sub_type = "CREATE";

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandlerManpower.verifyTokenFeedBack(token!);

    if (!verify) {
      logFormat.message = "Error Create Feedback";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const feedback = req.body.feedback;
    const id_project = verify.id_project;
    const id_user = verify.id;
    const id_material = req.body.id_material;
    const id_subarea = req.body.id_subarea;

    let data = {
      feedback: feedback,
      id_project: id_project,
      id_material: id_material,
      id_subarea: id_subarea,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Create Feedback";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Create Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getTotalByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get List Total Feedback";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id project");
    }

    const listTotal = await FeedbackAPIRepo.getTotalByIDProject(id_project);

    if (!listTotal) {
      throw new Error("Error Get List Total Feedback service feedback");
    }

    return res.status(200).json({
      message: "Success",
      data: listTotal.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get List Total Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getGraphYearNowByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Graph Feedback";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id project");
    }

    const dataGraph = await FeedbackAPIRepo.getGraphYearNowByIDProject(
      id_project
    );

    if (!dataGraph) {
      throw new Error("Error Get Graph Feedback service feedback");
    }

    return res.status(200).json({
      message: "Success",
      data: dataGraph.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Graph Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getAreaByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Area Feedback";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id project");
    }

    const dataArea = await FeedbackAPIRepo.getAreaByIDProject(id_project);

    if (!dataArea) {
      throw new Error("Error Get Area Feedback service feedback");
    }

    return res.status(200).json({
      message: "Success",
      data: dataArea.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Area Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getSubareaByIDArea(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error Get Subarea Feedback";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_area: number = parseFloat(req.params.id_area);

    if (isNaN(id_area)) {
      throw new Error("wrong type id project");
    }

    const dataSubArea = await FeedbackAPIRepo.getSubareaByIDArea(id_area);

    if (!dataSubArea) {
      throw new Error("Error Get Subarea Feedback service feedback");
    }

    return res.status(200).json({
      message: "Success",
      data: dataSubArea.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Subarea Feedback";
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
      logFormat.message = "Error Get Feedback";
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

    let id_project = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id_project");
    }

    const dataFeedback = await FeedbackAPIRepo.getByIDProject(
      id_project,
      start_date,
      end_date
    );

    if (!dataFeedback) {
      throw new Error("Error Get Feedback service feedback");
    }

    return res.status(200).json({
      message: "Success",
      data: dataFeedback.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getGraphBadByMonthByIDProject(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_project) {
      logFormat.message = "Error Get Graph Bad By IDProject Feedback";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_project: number = parseFloat(req.params.id_project);

    if (isNaN(id_project)) {
      throw new Error("wrong type id project");
    }

    var monthString = req.query.month as string;

    let month = parseFloat(monthString);

    if (isNaN(month)) {
      throw new Error("wrong type month");
    }

    const dataGraph = await FeedbackAPIRepo.getGraphBadByMonthByIDProject(
      id_project,
      month
    );

    if (!dataGraph) {
      throw new Error(
        "Error Get Graph Bad By IDproject Feedback service feedback"
      );
    }

    return res.status(200).json({
      message: "Success",
      data: dataGraph.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Graph Bad By IDProject Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getGraphBadByMonthByIDSubarea(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_subarea) {
      logFormat.message = "Error Get Graph Bad By IDSubarea Feedback";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    let id_subarea: number = parseFloat(req.params.id_subarea);

    if (isNaN(id_subarea)) {
      throw new Error("wrong type id subarea");
    }

    var monthString = req.query.month as string;

    let month = parseFloat(monthString);

    if (isNaN(month)) {
      throw new Error("wrong type month");
    }

    const dataGraph = await FeedbackAPIRepo.getGraphBadByMonthByIDSubarea(
      id_subarea,
      month
    );

    if (!dataGraph) {
      throw new Error(
        "Error Get Graph Bad By IDSubarea Feedback service feedback"
      );
    }

    return res.status(200).json({
      message: "Success",
      data: dataGraph.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error Get Graph Bad By IDSubarea Feedback";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
