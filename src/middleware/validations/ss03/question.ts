import { body, header } from "express-validator";

export const createValidation = () => [
  body("id_subarea")
    .exists()
    .withMessage("id_subarea required")
    .isInt({ min: 0 })
    .withMessage("id_subarea is number"),
  body("id_material")
    .exists()
    .withMessage("id_material required")
    .notEmpty()
    .withMessage("id_material not empty"),
];
