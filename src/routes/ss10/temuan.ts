import express from "express";
import * as TemuanController from "../../controllers/ss10/temuan";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as TemuanValidator from "../../middleware/validations/ss10/temuan";

const router = express.Router();

router.post(
  "/",
  TemuanValidator.createValidation(),
  ValidatorMiddleware.Validator,
  TemuanController.create
);

router.get("/client/:id_client", TemuanController.getByIDClient);

router.get("/project/:id_project", TemuanController.getByIDProject);

export default router;
