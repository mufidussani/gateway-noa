import { body, header } from "express-validator";

export const updateManpowerByIDValidation = () => [
  body("id_manpower")
    .exists()
    .withMessage("id_manpower required")
    .isString()
    .withMessage("id_manpower is string")
    .notEmpty()
    .withMessage("id_manpower not empty"),
];

export const updateStatusByIDValidation = () => [
  body("status")
    .exists()
    .withMessage("status required")
    .isInt({ min: 0, max: 4 })
    .withMessage("status is numeric 0 - 3"),
];

export const updateValidation = () => [
  body("start_date")
    .exists()
    .withMessage("required start_date")
    .isString()
    .withMessage("start_date is string")
    .notEmpty()
    .withMessage("start_date not empty"),
  body("end_date")
    .exists()
    .withMessage("required end_date")
    .isString()
    .withMessage("end_date is string")
    .notEmpty()
    .withMessage("end_date not empty"),
];
