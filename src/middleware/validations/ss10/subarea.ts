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
  body("id_tag")
    .exists()
    .withMessage("id_tag required")
    .isInt({ min: 0 })
    .withMessage("id_tag numeric"),
];

export const deleteValidation = () => [
  body("id")
    .exists()
    .withMessage("id required")
    .isInt({ min: 0 })
    .withMessage("id is numeric"),
  body("subarea")
    .exists()
    .withMessage("subarea required")
    .isString()
    .withMessage("subarea is string")
    .notEmpty()
    .withMessage("subarea not empty")
];
