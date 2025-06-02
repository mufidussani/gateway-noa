import { body, header } from "express-validator";

export const createValidation = () => [
  body("id_subarea")
    .exists()
    .withMessage("id_subarea required")
    .isInt({ min: 0 })
    .withMessage("id_subarea is numeric"),
  body("id_shift")
    .exists()
    .withMessage("id_shift required")
    .isInt({ min: 0 })
    .withMessage("id_shift is numeric"),
  body("id_manpower")
    .exists()
    .withMessage("id_manpower required")
    .isString()
    .withMessage("id_manpower is string")
    .notEmpty()
    .withMessage("id_manpower not empty"),
  body("data_result")
    .exists()
    .withMessage("data_result required")
    .notEmpty()
    .withMessage("data_result not empty"),
];

export const updateUnsolveByIDValidation = () => [
  body("detail_before")
    .exists()
    .withMessage("detail_before required")
    .isString()
    .withMessage("detail_before is string")
    .notEmpty()
    .withMessage("detail_before not empty"),
  body("image_before")
    .exists()
    .withMessage("image_before required")
    .notEmpty()
    .withMessage("image_before not empty")
    .isString()
    .withMessage("image_before is string base64"),
  body("detail_after")
    .exists()
    .withMessage("detail_after required")
    .isString()
    .withMessage("detail_after is string")
    .notEmpty()
    .withMessage("detail_after not empty"),
  body("image_after")
    .exists()
    .withMessage("image_after required")
    .notEmpty()
    .withMessage("image_after not empty")
    .isString()
    .withMessage("image_after is string base64"),
];

export const updateImageActionBeforeValidation = () => [
  body("image_action_before")
    .exists()
    .withMessage("image_action_before required")
    .isString()
    .withMessage("image_action_before is string base64")
    .notEmpty()
    .withMessage("image_action_before not empty"),
];

export const updateImageActionAfterValidataion = () => [
  body("image_action_after")
    .exists()
    .withMessage("image_action_after required")
    .isString()
    .withMessage("image_action_after is string base64")
    .notEmpty()
    .withMessage("image_action_after not empty"),
];

export const updateResultCheckValidation = () => [
  body("result")
    .exists()
    .withMessage("result required")
    .isInt({ max: 2 })
    .withMessage("result is numeric"),
  body("image_check")
    .exists()
    .withMessage("image_check required")
    .isString()
    .withMessage("image_check is string base64")
    .notEmpty()
    .withMessage("image_check not empty"),
];
