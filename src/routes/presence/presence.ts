import express from "express";
import * as PresenceController from "../../controllers/presence/presence";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as PresenceValidator from "../../middleware/validations/presence/presence";

const router = express.Router();

router.post(
  "/",
  PresenceValidator.createValidation(),
  ValidatorMiddleware.Validator,
  PresenceController.create
);

router.get("/manpower-today", PresenceController.getByIDManpowerToday);

router.put(
  "/out/:id",
  PresenceValidator.updateOutValidation(),
  ValidatorMiddleware.Validator,
  PresenceController.updateOut
);

router.get("/manpower-date", PresenceController.getManpowerDateRange);

router.get("/project/:id_project", PresenceController.getByIDProject);

router.get(
  "/project-date/:id_project",
  PresenceController.getByIDProjectDateRange
);

export default router;
