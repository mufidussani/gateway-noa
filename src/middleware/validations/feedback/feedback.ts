import { body, header } from "express-validator";

export const createValidation = () => [
  body("feedback")
    .exists()
    .withMessage("feedback required")
    .isString()
    .withMessage("feedback is string")
    .notEmpty()
    .withMessage("feedback not empty"),
  body("id_material").exists().withMessage("id_material required"),
  body("id_subarea")
    .exists()
    .withMessage("id_subarea required")
    .isInt({ min: 0 })
    .withMessage("id_subarea is numeric"),
];
