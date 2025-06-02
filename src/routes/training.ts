import express from "express";
import * as AuthMiddleware from "../middleware/auth";
import * as TrainingController from "../controllers/training";
import * as ValidatorMiddleware from "../middleware/validator";
import * as TrainingValidator from "../middleware/validations/training";

const router = express.Router();

router.get("/", AuthMiddleware.authUser, TrainingController.get);

router.post(
  "/",
  AuthMiddleware.authUser,
  TrainingValidator.validateRequest,
  ValidatorMiddleware.Validator,
  TrainingController.post
);

export default router;