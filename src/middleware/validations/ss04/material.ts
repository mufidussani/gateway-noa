import { body, header } from "express-validator";

export const createValidation = () => [
  body("material")
    .exists()
    .withMessage("material required")
    .isString()
    .withMessage("material is string")
    .notEmpty()
    .withMessage("material not empty"),
  body("standard")
    .exists()
    .withMessage("standard required")
    .isString()
    .withMessage("standard is string")
    .notEmpty()
    .withMessage("standard not empty"),
];

export const updateByIdValidation = () => [
  body("material")
    .exists()
    .withMessage("material required")
    .isString()
    .withMessage("material is string")
    .notEmpty()
    .withMessage("material not empty"),
  body("standard")
    .exists()
    .withMessage("standard required")
    .isString()
    .withMessage("standard is string")
    .notEmpty()
    .withMessage("standard not empty"),
];
