import express from "express";
import * as AreaController from "../../controllers/ss10/area";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as AreaValidator from "../../middleware/validations/ss10/area";
const router = express.Router();

router.post(
  "/",
  AreaValidator.createValidation(),
  ValidatorMiddleware.Validator,
  AreaController.create
);

router.get("/project/:id_project", AreaController.getByIdProject);

router.get("/:id", AreaController.getByID);

router.put(
  "/:id",
  AreaValidator.updateByIdValidation(),
  ValidatorMiddleware.Validator,
  AreaController.updateByID
);

export default router;
