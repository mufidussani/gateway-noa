import { body, header } from "express-validator";

export const createValidation = () => [
  body("tag")
    .exists()
    .withMessage("tag required")
    .isString()
    .withMessage("tag is string")
    .notEmpty()
    .withMessage("tag not empty"),
  body("id_area")
    .exists()
    .withMessage("id_area required")
    .isInt({ min: 0 })
    .withMessage("id_area is numeric"),
];
