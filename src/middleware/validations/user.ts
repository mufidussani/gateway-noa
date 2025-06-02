import { body, header } from "express-validator";
import { checkSingleValueInDatabase } from "../../repo/database/user";
export const loginValidation = () => [
  body("email")
    .exists()
    .withMessage("email required")
    .isString()
    .withMessage("email is string")
    .isEmail()
    .withMessage("text must be in email format"),
  body("password")
    .exists()
    .withMessage("password required")
    .isString()
    .withMessage("password is string"),
];

export const createValidation = () => [
  body("name")
    .exists()
    .withMessage("name required")
    .isString()
    .withMessage("name is string")
    .notEmpty()
    .withMessage("name not empty"),
  body("email")
    .exists()
    .withMessage("email required")
    .isString()
    .withMessage("email is string")
    .isEmail()
    .withMessage("text must be in email format"),
  body("password")
    .exists()
    .withMessage("password required")
    .isString()
    .withMessage("password is string")
    .notEmpty()
    .withMessage("password not empty"),
  body("id_level")
    .exists()
    .withMessage("id_level required")
    .isInt({ min: 0 })
    .withMessage("id_level is numeric"),
  body("no_hp")
    .exists()
    .withMessage("no_hp required")
    .notEmpty()
    .withMessage("no_hp not empty")
    .isInt({
      min: 15,
    })
    .withMessage("no_hp is numeric +62 format")
    .custom(checkSingleValueInDatabase("no_hp"))
    .withMessage("No Hp already used"),
];

export const validateManpowerValidation = () => [
  body("nip")
    .exists()
    .withMessage("nip required")
    .isString()
    .withMessage("nip is string")
    .notEmpty()
    .withMessage("nip not empty"),
];

export const verifyOTPManpowerValidation = () => [
  body("otp")
    .exists()
    .withMessage("otp required")
    .isString()
    .withMessage("otp is string")
    .notEmpty()
    .withMessage("otp not empty"),
  body("nip")
    .exists()
    .withMessage("nip required")
    .isString()
    .withMessage("nip is string")
    .notEmpty()
    .withMessage("nip not empty"),
];

export const updatePasswordManpowerByIDValidation = () => [
  body("password")
    .exists()
    .withMessage("password required")
    .isString()
    .withMessage("password is string")
    .notEmpty()
    .withMessage("password not empty"),
  body("repassword")
    .exists()
    .withMessage("repassword required")
    .isString()
    .withMessage("repassword is string")
    .notEmpty()
    .withMessage("repassword not empty"),
];

export const loginManpowerValidation = () => [
  body("nip")
    .exists()
    .withMessage("nip required")
    .isString()
    .withMessage("nip is string")
    .notEmpty()
    .withMessage("nip not empty"),
  body("password")
    .exists()
    .withMessage("password required")
    .isString()
    .withMessage("password is string")
    .notEmpty()
    .withMessage("password not empty"),
];
