import { body, header } from "express-validator";

export const createValidation = () => [
  body("frequency")
    .exists()
    .withMessage("frequency required")
    .isString()
    .withMessage("frequency is string")
    .notEmpty()
    .withMessage("frequency not empty"),
  body("total")
    .exists()
    .withMessage("total required")
    .isInt({ min: 0 })
    .withMessage("total is numeric"),
];
