import { body, header } from "express-validator";

export const createValidation = () => [
    body("nama")
    .exists()
    .withMessage("name required")
    .isString()
    .withMessage("name is string")
    .notEmpty()
    .withMessage("nama not empty"),

    body("company")
    .exists()
    .withMessage("company required")
    .isString()
    .withMessage("company is string")
    .notEmpty()
    .withMessage("company not empty"),

    body("no_hp")
    .exists()
    .withMessage("no_hp required")
    .notEmpty()
    .withMessage("no_hp not empty")
    .isInt()
    .matches(/^\+628\d{8,13}$/)
    .withMessage("no_hp needs to be integer and in +62 format"),

    body("bertemu")
    .exists()
    .withMessage("bertemu required")
    .isString()
    .withMessage("bertemu is string")
    .notEmpty()
    .withMessage("bertemu not empty"),

    body("tujuan")
    .exists()
    .withMessage("tujuan required")
    .isString()
    .withMessage("tujuan is string")
    .notEmpty()
    .withMessage("tujuan not empty"),

    body("id_project")
    .exists()
    .withMessage("id_project required")
    .isInt({min: 0})
    .withMessage("id_project is number")
    .notEmpty()
    .withMessage("id_project not empty")
]