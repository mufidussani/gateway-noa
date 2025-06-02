import { body, header } from "express-validator";

import { checkSingleValueExistedInDatabase } from "../../../repo/database/tag";

export const createValidation = () => [
  body("tag")
    .exists()
    .withMessage("tag required")
    .isString()
    .withMessage("tag is string")
    .notEmpty()
    .withMessage("tag not empty")
    .custom(checkSingleValueExistedInDatabase("tag"))
    .withMessage("tag not existed"),
  body("desc")
    .exists()
    .withMessage("desc required")
    .isString()
    .withMessage("desc is string")
    .notEmpty()
    .withMessage("desc not empty"),
  body("image")
    .exists()
    .withMessage("image required")
    .notEmpty()
    .withMessage("image not empty")
    .isString()
    .withMessage("image is string base64"),
];
