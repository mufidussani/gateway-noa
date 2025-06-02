import { Request, Response } from "express";
import { body, header, ValidationChain } from "express-validator";

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

    const trx_type = req.body.trx_type;
    const sub_type = req.body.sub_type;

    if (trx_type === "") {
      throw new Error("Empty trx_type");
    }

    if (sub_type === "") {
      throw new Error("Empty sub_type");
    }

    if (trx_type == "MASTER-TRAINING") {
      if (sub_type == "CREATE") {
        const rules_create = [
          body("training")
            .exists()
            .withMessage("training required")
            .isString()
            .withMessage("training is string")
            .notEmpty()
            .withMessage("training not empty"),
          body("description")
            .exists()
            .withMessage("description required")
            .isString()
            .withMessage("description is string")
            .notEmpty()
            .withMessage("description not empty"),
        ];
        rules.push(...rules_create);
      } else {
        throw new Error("sub_type not existed");
      }
    } else if (trx_type == "RECORD-TRAINING") {
      if (sub_type == "CREATE") {
        const rules_create = [
          body("id_manpower")
            .exists()
            .withMessage("id_manpower required")
            .isString()
            .withMessage("id_manpower is string")
            .notEmpty()
            .withMessage("id_manpower not empty"),
          body("id_training")
            .exists()
            .withMessage("id_training")
            .isInt({ min: 0 })
            .withMessage("id_training is numeric"),
        ];
        rules.push(...rules_create);
      }
    } else {
      throw new Error("trx_type not existed");
    }

    await Promise.all(rules.map((rule) => rule.run(req)));
    next();
  } catch (err: any) {
    next(err);
  }
}
