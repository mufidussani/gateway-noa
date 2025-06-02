import { Request, Response } from "express";
import { writeLogToFile, createLogFile } from "../utils/logger";
import * as TokenHandler from "../utils/tokenHandlerUser";
import * as TokenHandlerManpower from "../utils/tokenHandlerManpower";
import * as RedisRepo from "../repo/redis/user";
import AppError from "../utils/appError";

let currentLogFileName = createLogFile("middleware-auth");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

let nilValidator = ["", null, undefined];

export async function authUser(req: Request, res: Response, next: any) {
  try {
    const authorization = req.headers.authorization;

    const flag_manpower = req.headers.flag_manpower as string;

    if (nilValidator.includes(authorization)||nilValidator.includes(flag_manpower)) {
      logFormat.message = "Error Auth-User";
      logFormat.status = 400;
      logFormat.data = "Null Authorization";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(400).json({
        message: false,
        errors: "Null Authorization",
      });
    }

    var token = authorization?.split(" ")[1];

    
    const numFlagManpower = parseFloat(flag_manpower)

    if(numFlagManpower==0){
      var verify = TokenHandler.verifyToken(token!);

      if (!verify) {
        logFormat.message = "Error Verify";
        logFormat.status = 403;
        logFormat.data = "Forbidden " + token;
        const data_log = JSON.stringify(logFormat);
        writeLogToFile(data_log, currentLogFileName);
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      let redisUserData: any = await RedisRepo.getUserData(verify.id);

      if (!redisUserData) {
        throw new Error(`session not existed : ${token} `);
      }

      if (redisUserData != token) {
        throw new Error(`Forbidden session : ${token}`);
      }
    }
    else{
      var verify = TokenHandlerManpower.verifyToken(token!);

      const now = new Date();
      const unixTimestampNow = Math.floor(now.getTime() / 1000);

      let RedisUserData = await RedisRepo.getManpowerData(verify.id);

      if (!RedisUserData) {
        throw new Error(`Session not existed ${token}`);
      }

      // if (RedisUserData.expired_date < unixTimestampNow) {
      //   throw new Error(`Session Expired : ${token}`);
      // }
      if (RedisUserData.token != token) {
        throw new Error(`Forbidden session : ${token}`);
      }
    }

    next();
  } catch (err) {
    logFormat.message = "Error Auth";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function authSessionSetPWDManpower(
  req: Request,
  res: Response,
  next: any
) {
  try {
    const authorization = req.headers.authorization;

    if (nilValidator.includes(authorization)) {
      logFormat.message = "Error Auth-PWD Manpower";
      logFormat.status = 400;
      logFormat.data = "Null Authorization";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(400).json({
        message: false,
        errors: "Null Authorization",
      });
    }

    var token = authorization?.split(" ")[1] as string;

    var verify = TokenHandlerManpower.verifyTokenPWD(token!);

    if (!verify) {
      logFormat.message = "Error Verify";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const now = new Date();
    const unixTimestampNow = Math.floor(now.getTime() / 1000);

    let RedisUserData: any = await RedisRepo.getSessionPWDManpower(token);

    if (!RedisUserData) {
      throw new Error(`Session not existed ${token}`);
    }

    if (RedisUserData.expired_date < unixTimestampNow) {
      throw new Error(`Session Expired : ${token}`);
    }
    if (RedisUserData.token != token) {
      throw new Error(`Forbidden session : ${token}`);
    }

    next();
  } catch (err: any) {
    logFormat.message = "Error Auth-PWD Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function authManpower(req: Request, res: Response, next: any) {
  try {
    const authorization = req.headers.authorization;

    if (nilValidator.includes(authorization)) {
      logFormat.message = "Error Auth Manpower";
      logFormat.status = 400;
      logFormat.data = "Null Authorization";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(400).json({
        message: false,
        errors: "Null Authorization",
      });
    }
    var token = authorization?.split(" ")[1] as string;

    var verify = TokenHandlerManpower.verifyToken(token);

    const now = new Date();
    const unixTimestampNow = Math.floor(now.getTime() / 1000);

    let RedisUserData = await RedisRepo.getUserFeedBackData(verify.id);

    if (!RedisUserData) {
      throw new Error(`Session not existed ${token}`);
    }

    // if (RedisUserData.expired_date < unixTimestampNow) {
    //   throw new Error(`Session Expired : ${token}`);
    // }
    if (RedisUserData.token != token) {
      throw new Error(`Forbidden session : ${token}`);
    }

    next();
  } catch (err: any) {
    logFormat.message = "Error Auth Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}


export async function authFeedBack(req: Request, res: Response, next: any) {
  try {
    const authorization = req.headers.authorization;

    if (nilValidator.includes(authorization)) {
      logFormat.message = "Error Auth Manpower";
      logFormat.status = 400;
      logFormat.data = "Null Authorization";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(400).json({
        message: false,
        errors: "Null Authorization",
      });
    }
    var token = authorization?.split(" ")[1] as string;

    var verify = TokenHandlerManpower.verifyTokenFeedBack(token);

    const now = new Date();
    const unixTimestampNow = Math.floor(now.getTime() / 1000);

    let RedisUserData = await RedisRepo.getUserFeedBackData(verify.id);

    if (!RedisUserData) {
      throw new Error(`Session not existed ${token}`);
    }

    // if (RedisUserData.expired_date < unixTimestampNow) {
    //   throw new Error(`Session Expired : ${token}`);
    // }
    if (RedisUserData.token != token) {
      throw new Error(`Forbidden session : ${token}`);
    }

    next();
  } catch (err: any) {
    logFormat.message = "Error Auth Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);
    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}