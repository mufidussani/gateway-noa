import express from "express";
import * as TaskController from "../../controllers/ss01/task";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as TaskValidator from "../../middleware/validations/ss01/task";

const router = express.Router();

router.get("/working/:id_working", TaskController.getByIDWorking);

router.put(
  "/manpower/:id",
  TaskValidator.updateManpowerByIDValidation(),
  ValidatorMiddleware.Validator,
  TaskController.updateManpowerByID
);

router.put(
  "/status/:id",
  TaskValidator.updateStatusByIDValidation(),
  ValidatorMiddleware.Validator,
  TaskController.updateStatusByID
);

router.get("/detail/:id", TaskController.getByID);

router.put(
  "/:id",
  TaskValidator.updateValidation(),
  ValidatorMiddleware.Validator,
  TaskController.updateByID
);

export default router;
