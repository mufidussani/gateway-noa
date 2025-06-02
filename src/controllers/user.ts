import { Request, Response } from "express";
import mysql from "mysql2/promise";
import * as UserDBRepo from "../repo/database/user";
import * as ManpowerDBRepo from "../repo/database/manpower";
import * as ProjectDBRepo from "../repo/database/project";
import * as ClientDBRepo from "../repo/database/client";
import * as Redis from "../repo/redis/user";
import * as db from "../repo/database/db";
import AppError from "../utils/appError";
import * as TokenHandler from "../utils/tokenHandlerUser";
import * as TokenManpowerHandler from "../utils/tokenHandlerManpower";
const uuid = require("uuid");
import { writeLogToFile, createLogFile } from "../utils/logger";
import { hashPassword } from "../utils/passwordHash";
import * as WhatsAppAPI from "../third-party/whatsapp";
import * as OTPUtils from "../utils/otp";

let currentLogFileName = createLogFile("user");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

let empty_check = [null, "", undefined];

let level_admin = 1;

export async function create(req: Request, res: Response, next: any) {
  let connection: mysql.PoolConnection | undefined = undefined;
  try {
    var unique_id = uuid.v4();
    const id = unique_id.replaceAll("-", "");

    const name = req.body.name;
    const email = req.body.email;
    const password = hashPassword(req.body.password);
    const id_level = req.body.id_level;
    const no_hp = req.body.no_hp;

    var id_client = "0";
    var id_project = "0";

    var create_by = id;

    if (id_level != level_admin) {
      id_client = req.body.id_client;
      if (id_level == 2) {
        if (empty_check.includes(id_client)) {
          throw new Error("id_client required");
        }
      } else {
        id_project = req.body.id_project;

        if (empty_check.includes(id_client)) {
          throw new Error("id_client required");
        }

        if (empty_check.includes(id_project)) {
          throw new Error("id_project required");
        }

        let id_projectNumber: number = parseFloat(id_project);

        const idClientByProject = await ProjectDBRepo.getIdClientByIdProject(
          id_projectNumber
        );

        if (idClientByProject.length <= 0) {
          throw new Error("id_project does not match id_client");
        }
      }
    }

    if (id_level != level_admin) {
      var authorization = req.headers.authorization;

      var token = authorization?.split(" ")[1];

      var verify = TokenHandler.verifyToken(token!);

      if (!verify) {
        logFormat.message = "Error Create User";
        logFormat.status = 403;
        logFormat.data = "Forbidden " + token;
        const data_log = JSON.stringify(logFormat);
        writeLogToFile(data_log, currentLogFileName);
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      create_by = verify.id;
    }

    const create_data = {
      id: id,
      name: name,
      email: email,
      no_hp: no_hp,
      password: password,
      id_level: id_level,
      id_client: id_client,
      id_project: id_project,
      create_by: create_by,
    };

    connection = await db.beginTransaction();

    const createUser = await UserDBRepo.create(connection, create_data);

    if (createUser.affectedRows <= 0) {
      throw new Error("Error Create User");
    }

    await connection.commit();

    logFormat.message = "Success Create User";
    logFormat.status = 200;
    logFormat.data = create_data;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success Create User",
    });
  } catch (err) {
    if (connection) {
      await db.rollback(connection);
    }

    logFormat.message = "Error Create User";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function login(req: Request, res: Response, next: any) {
  try {
    const email = req.body.email;
    const password = hashPassword(req.body.password);

    let data_login = {
      email: email,
      password: password,
    };

    const userData = await UserDBRepo.login(data_login);

    if (userData.length === 0) {
      logFormat.message = "Error Login User";
      logFormat.status = 403;
      logFormat.data = "Forbidden access " + email;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({ message: "Forbidden" });
    }

    const data = userData[0];

    logFormat.message = "Success Login User";
    logFormat.status = 200;
    logFormat.data = email;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    let token = TokenHandler.generateToken(data);

    const storeRedis = await Redis.setUserData(data.id, token);

    if (storeRedis.err) {
      throw new Error("error store redis");
    }

    return res.status(200).json({
      message: "Ok",
      data: data,
      token: token,
      flag_manpower: 0,
    });
  } catch (err) {
    logFormat.message = "Error Login User";
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

    const userData = await UserDBRepo.getAll(offset, limit, searchValue);

    logFormat.message = "Success GetAll User";
    logFormat.status = 200;
    logFormat.data = userData;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: userData,
    });
  } catch (err) {
    logFormat.message = "Error GetAll User";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListClient(req: Request, res: Response, next: any) {
  try {
    var searchValue = req.query.search as string;

    if (empty_check.includes(searchValue)) {
      searchValue = "";
    }

    const listClient = await ClientDBRepo.getAllList(searchValue);

    logFormat.message = "Success GetList client";
    logFormat.status = 200;
    logFormat.data = listClient;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: listClient,
    });
  } catch (err) {
    logFormat.message = "Error Getlist client";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getListProjectByIdCLient(
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

    const listProject = await ProjectDBRepo.getProjectByIdClientList(id_client);

    logFormat.message = "Success Getlist project";
    logFormat.status = 200;
    logFormat.data = listProject;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: listProject,
    });
  } catch (err) {
    logFormat.message = "Error Getlist project";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function validationManpower(
  req: Request,
  res: Response,
  next: any
) {
  try {
    const nip = req.body.nip;

    const dataManpower = await ManpowerDBRepo.getByNIP(nip);

    if (dataManpower.length <= 0) {
      throw new Error("NIP Invalid");
    }

    let otp = OTPUtils.generateOTP(6);

    let expiredTime = OTPUtils.leftTimeOTP();

    let idManpower = dataManpower[0].id;

    const storeRedis = await Redis.setManpowerValidationSession(
      idManpower,
      nip,
      expiredTime,
      otp
    );

    if (storeRedis.err) {
      throw new Error("error store redis");
    }

    let message = `Kode OTP Anda adalah ${otp}. Kode ini berlaku selama 1 menit. Mohon jangan berikan kode ini kepada siapa pun.`;

    const pushWa = await WhatsAppAPI.pushWa(dataManpower[0].no_hp, message);

    if (!pushWa) {
      throw new Error("Error Push WA");
    }

    logFormat.message = "Success Verify Manpower";
    logFormat.status = 200;
    logFormat.data = nip;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Ok",
    });
  } catch (err: any) {
    logFormat.message = "Error Validation Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function verifyOTPManpower(
  req: Request,
  res: Response,
  next: any
) {
  try {
    const otp = req.body.otp;

    const nip = req.body.nip;

    const now = new Date();
    const unixTimestampNow = Math.floor(now.getTime() / 1000);

    const dataManpower = await ManpowerDBRepo.getByNIP(nip);

    if (dataManpower.length <= 0) {
      throw new Error("NIP Invalid");
    }

    const dataRedis = await Redis.getManpowerValidationSession(
      dataManpower[0].id
    );

    if (!dataRedis) {
      throw new Error("error read redis");
    }

    let expiredDate = parseFloat(dataRedis.expired_date);

    if (isNaN(expiredDate)) {
      throw new Error("Wrong expired unix type");
    }

    if (unixTimestampNow > expiredDate) {
      throw new Error("Expired OTP");
    }

    if (dataRedis.otp != otp) {
      throw new Error("Wrong OTP");
    }

    let token = TokenManpowerHandler.generateTokenPWD(dataManpower[0]);

    const storePWDRedis = await Redis.setSessionPWDManpower(
      dataManpower[0].id,
      token,
      unixTimestampNow + 300
    );

    if (storePWDRedis.err) {
      throw new Error("error store redis");
    }

    logFormat.message = "Success Verify OTP Manpower";
    logFormat.status = 200;
    logFormat.data = nip;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Ok",
      token: token,
    });
  } catch (err: any) {
    logFormat.message = "Error verify OTP Manpower";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updatePasswordByID(
  req: Request,
  res: Response,
  next: any
) {
  let connection: mysql.PoolConnection | undefined = undefined;

  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenManpowerHandler.verifyTokenPWD(token!);

    if (!verify) {
      logFormat.message = "Error Create Tour";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = verify.id;
    const password = req.body.password;
    const repassword = req.body.repassword;

    connection = await db.beginTransaction();

    if (password != repassword) {
      throw new Error("password invalid");
    }

    let data_update = {
      id: id,
      password: hashPassword(password),
    };

    const updatePWD = await ManpowerDBRepo.updatePasswordByID(
      connection,
      data_update
    );

    if (updatePWD.affectedRows <= 0) {
      throw new Error("Error Update Password");
    }

    await connection.commit();

    logFormat.message = "Success Update Password Manpower";
    logFormat.status = 200;
    logFormat.data = id;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success Update Password Manpower",
    });
  } catch (err: any) {
    if (connection) {
      await db.rollback(connection);
    }

    logFormat.message = "Error Update Password Manpower By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function loginManpower(req: Request, res: Response, next: any) {
  try {
    const nip = req.body.nip;
    const password = hashPassword(req.body.password);

    const now = new Date();
    const unixTimestampNow = Math.floor(now.getTime() / 1000);

    const dataManpower = await ManpowerDBRepo.login(nip, password);

    if (dataManpower.length <= 0) {
      throw new Error(`Forbidden access ${nip}`);
    }

    const data = dataManpower[0];

    const token = TokenManpowerHandler.generateToken(data);

    const storeRedis = await Redis.setManpowerData(
      data.id,
      token,
      unixTimestampNow + 3600
    );

    if (storeRedis.err) {
      throw new Error("error store redis");
    }

    logFormat.message = "Success Login Manpower";
    logFormat.status = 200;
    logFormat.data = nip;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Ok",
      data: data,
      token: token,
      flag_manpower: 1,
    });
  } catch (err: any) {
    logFormat.message = "Error Login";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function loginFeedBack(req: Request, res: Response, next: any) {
  try {
    const nip = req.body.nip;
    const password = hashPassword(req.body.password);

    const now = new Date();
    const unixTimestampNow = Math.floor(now.getTime() / 1000);

    const dataManpower = await ManpowerDBRepo.login(nip, password);

    if (dataManpower.length <= 0) {
      throw new Error(`Forbidden access ${nip}`);
    }

    const data = dataManpower[0];

    const token = TokenManpowerHandler.generateTokenFeedBack(data);

    const storeRedis = await Redis.setUserFeedBackData(
      data.id,
      token,
      unixTimestampNow + 86400
    );

    if (storeRedis.err) {
      throw new Error("error store redis");
    }

    logFormat.message = "Success Login Manpower";
    logFormat.status = 200;
    logFormat.data = nip;

    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Ok",
      data: data,
      token: token,
      flag_manpower: 1,
    });
  } catch (err: any) {
    logFormat.message = "Error Login";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
