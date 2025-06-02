import { body, header } from "express-validator";

export const createValidation = () => [
  body("subarea")
    .exists()
    .withMessage("subarea required")
    .isString()
    .withMessage("subarea is string")
    .notEmpty()
    .withMessage("subarea not empty"),
  body("id_area")
    .exists()
    .withMessage("id_area required")
    .isInt({ min: 0 })
    .withMessage("id_area is numeric"),
];

export const updateValidation = () => [
  body("subarea")
    .exists()
    .withMessage("subarea required")
    .isString()
    .withMessage("subarea is string")
    .notEmpty()
    .withMessage("subarea not empty"),
  body("is_feedback")
    .exists()
    .withMessage("is_feedback required")
    .isInt()
    .withMessage("is_feedback is numeric"),
];