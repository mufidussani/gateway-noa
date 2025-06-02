import express from "express";
import * as SubAreaController from "../../controllers/ss10/subarea";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as SubAreaValidator from "../../middleware/validations/ss10/subarea";
const router = express.Router();

router.post(
  "/",
  SubAreaValidator.createValidation(),
  ValidatorMiddleware.Validator,
  SubAreaController.create
);

router.get("/area/:id_area", SubAreaController.getByIdArea);

router.get("/:id", SubAreaController.getByID);

router.put(
  "/:id",
  SubAreaValidator.updateValidation(),
  ValidatorMiddleware.Validator,
  SubAreaController.updateByID
);

router.delete(
  "/:id/", 
SubAreaValidator.deleteValidation(), 
ValidatorMiddleware.Validator,
SubAreaController.deleteById
);

export default router;
