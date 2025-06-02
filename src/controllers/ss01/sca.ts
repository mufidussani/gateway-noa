import { Request, Response } from "express";
import * as ScaAPIRepo from "../../repo/api/ss01/sca";
import * as TokenHandler from "../../utils/tokenHandlerUser";
import * as TokenHandlerManpower from "../../utils/tokenHandlerManpower";
import * as Redis from "../../repo/redis/ss01/stream";
import AppError from "../../utils/appError";
import {
  writeLogToFile,
  createLogFile,
  backupLogFile,
} from "../../utils/logger";

let currentLogFileName = createLogFile("ss01-sca");

const logFormat = {
  message: "",
  status: 0,
  data: {},
};

const trx_type = "SCA";

require("dotenv").config();

let empty_check = [null, "", undefined];

// export async function create(req: Request, res: Response, next: any) {
//   const sub_type = "CREATE";

//   try {
//     var authorization = req.headers.authorization;

//     var token = authorization?.split(" ")[1];

//     var verify = TokenHandler.verifyToken(token!);

//     if (!verify) {
//       logFormat.message = "Error Create Sca";
//       logFormat.status = 403;
//       logFormat.data = "Forbidden " + token;
//       const data_log = JSON.stringify(logFormat);
//       writeLogToFile(data_log, currentLogFileName);
//       return res.status(403).json({
//         message: "Forbidden",
//       });
//     }

//     const id_subarea = req.body.id_subarea;
//     const id_shift = req.body.id_shift;
//     const data_result = req.body.data_result;
//     const id_manpower = req.body.id_manpower;
//     const id_user = verify.id;

//     if (data_result.length <= 0) {
//       throw new Error("Empty Cheklist Result");
//     }

//     let data = {
//       id_subarea: id_subarea,
//       id_shift: id_shift,
//       data_result: data_result,
//       id_manpower: id_manpower,
//     };

//     Redis.messageFormat.trx_type = trx_type;
//     Redis.messageFormat.sub_type = sub_type;
//     Redis.messageFormat.data = data;
//     Redis.messageFormat.id_user = id_user;

//     await Redis.publisher(Redis.messageFormat);

//     logFormat.message = "Processing Create SCA";
//     logFormat.status = 200;
//     logFormat.data = data;
//     const data_log = JSON.stringify(logFormat);

//     writeLogToFile(data_log, currentLogFileName);

//     return res.status(200).json({
//       message: "Success",
//       data: "Message On Process",
//     });
//   } catch (err) {
//     logFormat.message = "Error Create SCA";
//     logFormat.status = 500;
//     logFormat.data = err!;
//     const data_log = JSON.stringify(logFormat);

//     writeLogToFile(data_log, currentLogFileName);
//     return next(new AppError(err, 500));
//   }
// }

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

    const dataSca = await ScaAPIRepo.getAll(searchValue, limit, offset);

    if (!dataSca) {
      throw new Error("Error GetSca All service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataSca.data.data,
      total: dataSca.data.total,
    });
  } catch (err) {
    logFormat.message = "Error GetSca All";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getDetailByIDSca(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_sca) {
      logFormat.message = "Error GetDetailSca By IDSca";
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

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    const id_sca = req.params.id_sca;

    const dataDetailSca = await ScaAPIRepo.getDetailByIDSca(
      searchValue,
      limit,
      offset,
      id_sca
    );

    if (!dataDetailSca) {
      throw new Error("Error GetDetailSca By IDSca service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataDetailSca.data.data,
      total: dataDetailSca.data.total,
    });
  } catch (err) {
    logFormat.message = "Error GetDetailSca By IDSca";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getUnsolve(req: Request, res: Response, next: any) {
  try {
    var authorization = req.headers.authorization;

    var token = authorization?.split(" ")[1];

    var verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error GetUnsolve";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id_user = verify.id;

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

    const dataUnsolve = await ScaAPIRepo.getUnsolveByIDUser(
      searchValue,
      limit,
      offset,
      id_user
    );

    if (!dataUnsolve) {
      throw new Error("Error GetUnsolve service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataUnsolve.data.data,
    });
  } catch (err) {
    logFormat.message = "Error GetUnsolve";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateUnsolveByID(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "UPDATE-UNSOLVE-BY-ID";
  try {
    if (!req.params.id) {
      logFormat.message = "Error Update Unsolve By ID";
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
      logFormat.message = "Error Update Unsolve By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const detail_before = req.body.detail_before;
    const image_before = req.body.image_before;
    const detail_after = req.body.detail_after;
    const image_after = req.body.image_after;
    const id_user = verify.id;

    let data = {
      id: req.params.id,
      detail_before: detail_before,
      image_before: image_before,
      detail_after: detail_after,
      image_after: image_after,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update Unsolve SCA";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err) {
    logFormat.message = "Error Update Unsolve By ID";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getDetailByIDTask(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_task) {
      logFormat.message = "Error GetDetail By IDTask";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    const id_task = req.params.id_task;

    const listDetail = await ScaAPIRepo.getDetailByIDTask(id_task);

    if (!listDetail) {
      throw new Error("Error GetDetailSca By IDTask service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listDetail.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GetDetail By IDTask";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateImageActionBeforeByID(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "UPDATE-IMAGE-ACTION-BEFORE-BY-ID";

  try {
    if (!req.params.id) {
      logFormat.message = "Error Update image action before By ID";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var authorization = req.headers.authorization;

    var flag_manpower = req.headers.flag_manpower as string;

    var token = authorization?.split(" ")[1];

    var verify: any;

    var numFlagManpower = parseFloat(flag_manpower);

    if (numFlagManpower == 0) {
      verify = TokenHandler.verifyToken(token!);
    } else {
      verify = TokenHandlerManpower.verifyToken(token!);
    }

    // verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Update image action before By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const image_action_before = req.body.image_action_before;
    const id_user = verify.id;

    let data = {
      image_action_before: image_action_before,
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update image action before By ID";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update image action before By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateImageActionAfterByID(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "UPDATE-IMAGE-ACTION-AFTER-BY-ID";

  try {
    if (!req.params.id) {
      logFormat.message = "Error Update image action after By ID";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    var authorization = req.headers.authorization;

    var flag_manpower = req.headers.flag_manpower as string;

    var token = authorization?.split(" ")[1];

    var numFlagManpower = parseFloat(flag_manpower);

    var verify: any;

    if (numFlagManpower == 0) {
      verify = TokenHandler.verifyToken(token!);
    } else {
      verify = TokenHandlerManpower.verifyToken(token!);
    }

    // verify = TokenHandler.verifyToken(token!);

    if (!verify) {
      logFormat.message = "Error Update image action after By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const image_action_after = req.body.image_action_after;
    const id_user = verify.id;

    let data = {
      image_action_after: image_action_after,
      id: id,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update image action after By ID";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update image action after By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getDetailCheckByIDTask(
  req: Request,
  res: Response,
  next: any
) {
  try {
    if (!req.params.id_task) {
      logFormat.message = "Error GetDetail Check By IDTask";
      logFormat.status = 404;
      logFormat.data = "Not Found";
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return next(new AppError("Not Found", 404));
    }

    const id_task = req.params.id_task;

    const listDetail = await ScaAPIRepo.getDetailCheckByIDTask(id_task);

    if (!listDetail) {
      throw new Error("Error GetDetailSca Check By IDTask service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: listDetail.data.data,
    });
  } catch (err: any) {
    logFormat.message = "Error GetDetail Check By IDTask";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function updateResultCheckByID(
  req: Request,
  res: Response,
  next: any
) {
  const sub_type = "UPDATE-RESULT-CHECK-BY-ID";

  try {
    if (!req.params.id) {
      logFormat.message = "Error Update image action after By ID";
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
      logFormat.message = "Error Update result By ID";
      logFormat.status = 403;
      logFormat.data = "Forbidden " + token;
      const data_log = JSON.stringify(logFormat);
      writeLogToFile(data_log, currentLogFileName);
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const id = req.params.id;
    const result = req.body.result;
    const image_check = req.body.image_check;
    const id_user = verify.id;

    let data = {
      id: id,
      result: result,
      image_check: image_check,
    };

    Redis.messageFormat.trx_type = trx_type;
    Redis.messageFormat.sub_type = sub_type;
    Redis.messageFormat.data = data;
    Redis.messageFormat.id_user = id_user;

    await Redis.publisher(Redis.messageFormat);

    logFormat.message = "Processing Update result By ID";
    logFormat.status = 200;
    logFormat.data = data;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);

    return res.status(200).json({
      message: "Success",
      data: "Message On Process",
    });
  } catch (err: any) {
    logFormat.message = "Error Update result By ID";
    logFormat.status = 500;
    logFormat.data = { err: err.toString() };
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}

export async function getByIDArea(req: Request, res: Response, next: any) {
  try {
    if (!req.params.id_area) {
      logFormat.message = "Error GetSca By ID Area";
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

    const id_area = parseFloat(req.params.id_area);

    if (isNaN(limit)) {
      limit = 10;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    if (isNaN(id_area)) {
      throw new Error("invalid id_area");
    }

    const dataSca = await ScaAPIRepo.getByIDArea(
      searchValue,
      limit,
      offset,
      id_area
    );

    if (!dataSca) {
      throw new Error("Error GetSca By ID Area service ss01");
    }

    return res.status(200).json({
      message: "Success",
      data: dataSca.data.data,
      total: dataSca.data.total,
    });
  } catch (err) {
    logFormat.message = "Error GetSca By ID Area";
    logFormat.status = 500;
    logFormat.data = err!;
    const data_log = JSON.stringify(logFormat);

    writeLogToFile(data_log, currentLogFileName);
    return next(new AppError(err, 500));
  }
}
