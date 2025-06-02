import { body, header } from "express-validator";

export const createValidation = () => [
  body("nip")
    .exists()
    .withMessage("nip required")
    .isString()
    .withMessage("nip is string"),
  body("id_shift")
    .exists()
    .withMessage("id_shift required")
    .isInt({ min: 0 })
    .withMessage("id_shift is numeric"),
  body("time_in")
    .exists()
    .withMessage("time_in required")
    .isString()
    .withMessage("time_in is string time format"),
  body("lat_in")
    .exists()
    .withMessage("lat_in required")
    .isFloat()
    .withMessage("lat_in is numeric"),
  body("lng_in")
    .exists()
    .withMessage("lng_in required")
    .isFloat()
    .withMessage("lng_in is numeric"),
];

export const updateOutValidation = () => [
  body("time_out")
    .exists()
    .withMessage("time_out required")
    .isString()
    .withMessage("time_out is string time format"),
  body("lat_out")
    .exists()
    .withMessage("lat_out required")
    .isFloat()
    .withMessage("lat_out is numeric"),
  body("lng_out")
    .exists()
    .withMessage("lng_out required")
    .isFloat()
    .withMessage("lng_out is numeric"),
];
