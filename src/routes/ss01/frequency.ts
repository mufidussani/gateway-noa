import express from "express";
import * as FrequencyController from "../../controllers/ss01/frequency";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as FrequencyValidator from "../../middleware/validations/ss01/frequency";
const router = express.Router();

router.post(
  "/",
  FrequencyValidator.createValidation(),
  ValidatorMiddleware.Validator,
  FrequencyController.create
);

router.get("/", FrequencyController.getAll);

export default router;
