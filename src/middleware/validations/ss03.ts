import { Request, Response } from "express";
import { body, header, ValidationChain } from "express-validator";
import * as AreaValidator from "./ss03/area";

let empty_check = [null, "", undefined];

export async function validateRequest(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const rules = [
      body("trx_type")
        .exists()
        .withMessage("trx_type required")
        .isString()
        .withMessage("trx_type is string")
        .notEmpty()
        .withMessage("trx_type not empty"),
      body("sub_type")
        .exists()
        .withMessage("sub_type required")
        .isString()
        .withMessage("sub_type is string")
        .notEmpty()
        .withMessage("sub_type not empty"),
    ];

    var rulesAdd: ValidationChain[] = [];

    const trx_type = req.body.trx_type;
    const sub_type = req.body.sub_type;

    if (empty_check.includes(trx_type)) {
      throw new Error("Empty trx_type");
    }

    if (empty_check.includes(sub_type)) {
      throw new Error("Empty sub_type");
    }

    if (trx_type == "AREA") {
      if (sub_type == "CREATE") {
        rulesAdd = AreaValidator.createValidation();
        rules.push(...rulesAdd);
      } else if (sub_type == "UPDATE-BY-ID") {
        rulesAdd = AreaValidator.updateByIdValidation();
        rules.push(...rulesAdd);
      }
    }

    await Promise.all(rules.map((rule) => rule.run(req)));
    next();
  } catch (err: any) {
    next(err);
  }
}
