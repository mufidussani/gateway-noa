import express from "express";
import * as AreaController from "../../controllers/ss01/area";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as AreaValidator from "../../middleware/validations/ss01/area";
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

router.get("/list/project/:id_project",AreaController.getListByIdProject)

export default router;
