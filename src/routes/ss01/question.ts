import express from "express";
import * as QuestionController from "../../controllers/ss01/question";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as QuestionValidator from "../../middleware/validations/ss01/question";

const router = express.Router();

router.post(
  "/",
  QuestionValidator.createValidation(),
  ValidatorMiddleware.Validator,
  QuestionController.create
);

router.get("/material/:id_subarea", QuestionController.getMaterialByIDSubarea);

export default router;
