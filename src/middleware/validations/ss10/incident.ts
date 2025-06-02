import { body, header } from "express-validator";

export const createValidation = () => [
  body("id_subarea")
    .exists()
    .withMessage("id_subarea required")
    .isInt({ min: 0 })
    .withMessage("id_subarea is numeric"),
  body("id_shift")
    .exists()
    .withMessage("id_subarea required")
    .isInt({ min: 0 })
    .withMessage("id_subarea is numeric"),
  body("desc")
    .exists()
    .withMessage("desc required")
    .notEmpty()
    .withMessage("desc not empty")
    .isString()
    .withMessage("desc is string"),
  body("image")
    .exists()
    .withMessage("image required")
    .notEmpty()
    .withMessage("image not empty")
    .isString()
    .withMessage("image is string base64"),
  body("id_category")
    .exists()
    .withMessage("id_category required")
    .isInt({ min: 0 })
    .withMessage("id_category is numeric"),
  body("time")
    .exists()
    .withMessage("time required")
    .notEmpty()
    .withMessage("time not empty")
    .isString()
    .withMessage("time is string YYYY-MM-DD H:i:s"),
];
