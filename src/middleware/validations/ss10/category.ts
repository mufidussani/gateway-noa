import { body, header } from "express-validator";

export const createValidation = () => [
  body("category")
    .exists()
    .withMessage("category required")
    .isString()
    .withMessage("category is string")
    .notEmpty()
    .withMessage("category not empty"),
];
