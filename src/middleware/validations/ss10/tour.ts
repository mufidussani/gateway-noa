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
];
