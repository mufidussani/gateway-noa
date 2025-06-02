import express from "express";
import * as ManpowerController from "../../controllers/ss01/manpower";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as ManpowerValidator from "../../middleware/validations/ss01/manpower";

const router = express.Router();

router.post(
  "/",
  ManpowerValidator.createValidation(),
  ValidatorMiddleware.Validator,
  ManpowerController.create
);

router.get("/project/:id_project", ManpowerController.getByIDProject);

router.get("/:id", ManpowerController.getByID);

router.put(
  "/no-hp/:id",
  ManpowerValidator.updateNoHpValidation(),
  ValidatorMiddleware.Validator,
  ManpowerController.updateNoHpByID
);

router.put(
  "/nip/:id",
  ManpowerValidator.updateNIPValidation(),
  ValidatorMiddleware.Validator,
  ManpowerController.updateNIPbyID
);

router.put(
  "/manpower-project/:id",
  ManpowerValidator.updateProjectValidation(),
  ValidatorMiddleware.Validator,
  ManpowerController.updateProjectById
);

export default router;
