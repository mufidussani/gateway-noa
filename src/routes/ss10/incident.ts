import express from "express";
import * as IncidentController from "../../controllers/ss10/incident";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as IncidentValidator from "../../middleware/validations/ss10/incident";

const router = express.Router();

router.post(
  "/",
  IncidentValidator.createValidation(),
  ValidatorMiddleware.Validator,
  IncidentController.create
);

router.get("/client/:id_client", IncidentController.getByIDClient);

router.get("/project/:id_project", IncidentController.getByIDProject);

export default router;
