import express from "express";
import * as ShiftController from "../../controllers/ss01/shift";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as ShiftValidator from "../../middleware/validations/ss01/shift";

const router = express.Router();

router.post(
  "/",
  ShiftValidator.createValidation(),
  ValidatorMiddleware.Validator,
  ShiftController.create
);

router.get("/", ShiftController.getAll);

router.put(
  "/:id",
  ShiftValidator.updateValidation(),
  ValidatorMiddleware.Validator,
  ShiftController.updateByID
);

router.get("/list-project/:id_project", ShiftController.getListByIDProject);

export default router;
