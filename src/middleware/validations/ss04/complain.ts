import { body, header } from "express-validator";

export const createValidation = [
  body("id_subarea")
    .exists()
    .withMessage("id_subarea required")
    .isInt({ min: 0 })
    .withMessage("id_subarea is numeric"),
  body("image")
    .exists()
    .withMessage("image required")
    .notEmpty()
    .withMessage("image not empty")
    .isString()
    .withMessage("image is string base64"),
  body("complain")
    .exists()
    .withMessage("complain required")
    .isString()
    .withMessage("complain is string")
    .notEmpty()
    .withMessage("complain not empty"),
  body("id_material")
    .exists()
    .withMessage("id_material required")
    .isInt({ min: 0 })
    .withMessage("id_material is numeric"),
];

export const updateSolveValidationByID = [
  body("detail_tindak_lanjut")
    .exists()
    .withMessage("detail_tindak_lanjut required")
    .notEmpty()
    .withMessage("detail_tindak_lanjut not empty")
    .isString()
    .withMessage("detail_tindak_lanjut is string"),
  body("image_tindak_lanjut")
    .exists()
    .withMessage("image_tindak_lanjut required")
    .notEmpty()
    .withMessage("imge_tindak_lanjut not empty")
    .isString()
    .withMessage("image_tindak_lanjut is string base64"),
  body("action_by")
    .exists()
    .withMessage("action_by required")
    .notEmpty()
    .withMessage("action_by not empty")
    .isString()
    .withMessage("action_by is string"),
];

export const updateActionByIDValidation = [
  body("desc")
    .exists()
    .withMessage("desc required")
    .isString()
    .withMessage("desc is string")
    .notEmpty()
    .withMessage("desc not empty"),
  body("id_shift")
    .exists()
    .withMessage("id_shift required")
    .isInt({ min: 0 })
    .withMessage("id_shift is numeric"),
  body("duration")
    .exists()
    .withMessage("duration required")
    .isInt({ min: 0 })
    .withMessage("duration is numeric"),
  body("id_frequency")
    .exists()
    .withMessage("id_frequency required")
    .isInt({ min: 0 })
    .withMessage("id_frequency is numeric"),
  body("init_date")
    .exists()
    .withMessage("init_date required")
    .isString()
    .withMessage("init_date is string")
    .notEmpty()
    .withMessage("init_date not empty"),
  body("id_manpower")
    .exists()
    .withMessage("id_manpower required")
    .isString()
    .withMessage("id_manpower is string")
    .notEmpty()
    .withMessage("id_manpower not empty"),
];
