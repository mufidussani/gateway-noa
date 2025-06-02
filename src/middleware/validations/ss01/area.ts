import { body, header } from "express-validator";

export const createValidation = () => [
  body("area")
    .exists()
    .withMessage("area required")
    .isString()
    .withMessage("area is string")
    .notEmpty()
    .withMessage("area not empty"),
  body("id_project")
    .exists()
    .withMessage("id_project required")
    .isInt({ min: 0 })
    .withMessage("id_project is numeric"),
];

export const updateByIdValidation = () => [
  body("area")
    .exists()
    .withMessage("area required")
    .isString()
    .withMessage("area is string")
    .notEmpty()
    .withMessage("area not empty"),
  body("id_project")
    .exists()
    .withMessage("id_project required")
    .isInt({ min: 0 })
    .withMessage("id_project is numeric"),
];
