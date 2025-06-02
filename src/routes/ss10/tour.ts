import express from "express";
import * as TourController from "../../controllers/ss10/tour";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as TourValidator from "../../middleware/validations/ss10/tour";

const router = express.Router();

router.post(
  "/",
  TourValidator.createValidation(),
  ValidatorMiddleware.Validator,
  TourController.create
);

router.get("/client/:id_client", TourController.getByIDClient);

router.get("/project/:id_project", TourController.getByIDProject);

export default router;
