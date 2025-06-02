import express from "express";
import * as AuthMiddleware from "../middleware/auth";
import * as ValidatorMiddleware from "../middleware/validator";
import * as UserValidator from "../middleware/validations/user";
import * as UserController from "../controllers/user";
const router = express.Router();

router.post(
  "/",
  UserValidator.createValidation(),
  ValidatorMiddleware.Validator,
  AuthMiddleware.authUser,
  UserController.create
);

router.post(
  "/login",
  UserValidator.loginValidation(),
  ValidatorMiddleware.Validator,
  UserController.login
);

router.get("/", AuthMiddleware.authUser, UserController.getAll);

router.get("/client", AuthMiddleware.authUser, UserController.getListClient);

router.get(
  "/project/:id_client",
  AuthMiddleware.authUser,
  UserController.getListProjectByIdCLient
);

router.post(
  "/manpower/verify",
  UserValidator.validateManpowerValidation(),
  ValidatorMiddleware.Validator,
  UserController.validationManpower
);

router.post(
  "/manpower/otp/verify",
  UserValidator.verifyOTPManpowerValidation(),
  ValidatorMiddleware.Validator,
  UserController.verifyOTPManpower
);

router.put(
  "/manpower/password",
  UserValidator.updatePasswordManpowerByIDValidation(),
  ValidatorMiddleware.Validator,
  AuthMiddleware.authSessionSetPWDManpower,
  UserController.updatePasswordByID
);

router.post(
  "/manpower/login",
  UserValidator.loginManpowerValidation(),
  ValidatorMiddleware.Validator,
  UserController.loginManpower
);

router.post(
  "/feedback/login",
  UserValidator.loginManpowerValidation(),
  ValidatorMiddleware.Validator,
  UserController.loginFeedBack
);

export default router;
