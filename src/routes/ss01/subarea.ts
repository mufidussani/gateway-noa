import express from "express";
import * as SubAreaController from "../../controllers/ss01/subarea";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as SubAreaValidator from "../../middleware/validations/ss01/subarea";
const router = express.Router();

router.post(
  "/",
  SubAreaValidator.createValidation(),
  ValidatorMiddleware.Validator,
  SubAreaController.create
);

router.get("/area/:id_area", SubAreaController.getByIdArea);

router.get("/:id", SubAreaController.getByID);

router.get("/list/area/:id_area", SubAreaController.getListByIdArea);

router.put(
  "/:id",
  SubAreaValidator.updateValidation(),
  ValidatorMiddleware.Validator,
  SubAreaController.updateByID
);

router.delete("/:id", SubAreaController.deleteById);

export default router;
