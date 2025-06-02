import { body, header } from "express-validator";

export const createValidation = () => [
  body("shift")
    .exists()
    .withMessage("shift required")
    .isString()
    .withMessage("shift is string")
    .notEmpty()
    .withMessage("shift not empty"),
  body("start_time")
    .exists()
    .withMessage("start_time required")
    .isTime({ hourFormat: "hour24", mode: "withSeconds" })
    .withMessage("start_time in timeformat"),
  body("end_time")
    .exists()
    .withMessage("end_time required")
    .isTime({ hourFormat: "hour24", mode: "withSeconds" })
    .withMessage("end_time in timeformat"),
  body("id_project")
    .exists()
    .withMessage("id_project required")
    .isInt({ min: 0 })
    .withMessage("id_project is numeric")
];

export const updateValidation = () => [
  body("id")
    .exists()
    .withMessage("id required")
    .isInt({ min: 0 })
    .withMessage("id is numeric"),
  body("shift")
    .exists()
    .withMessage("shift required")
    .isString()
    .withMessage("shift is string")
    .notEmpty()
    .withMessage("shift not empty"),
    body("start_time")
    .exists()
    .withMessage("start_time required")
    .isTime({ hourFormat: "hour24", mode: "withSeconds" })
    .withMessage("start_time in timeformat"),
  body("end_time")
    .exists()
    .withMessage("end_time required")
    .isTime({ hourFormat: "hour24", mode: "withSeconds" })
    .withMessage("end_time in timeformat")
];