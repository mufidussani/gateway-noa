import express from "express";
import * as AuthMiddleware from "../middleware/auth";
import * as ValidatorMiddleware from "../middleware/validator";
import * as SS03Validator from "../middleware/validations/ss03";
import * as SS03Controller from "../controllers/ss03";

const router = express.Router();

router.get("/", AuthMiddleware.authUser, SS03Controller.get);

router.post(
  "/",
  AuthMiddleware.authUser,
  SS03Validator.validateRequest,
  ValidatorMiddleware.Validator,
  SS03Controller.post
);

export default router;
