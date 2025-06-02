import express from "express";
import * as CategoryController from "../../controllers/ss10/category";
import * as ValidataorMiddleware from "../../middleware/validator";
import * as CategoryValidator from "../../middleware/validations/ss10/category";

const router = express.Router();

router.post(
  "/",
  CategoryValidator.createValidation(),
  ValidataorMiddleware.Validator,
  CategoryController.create
);

router.get("/", CategoryController.getAll);

router.get("/list", CategoryController.getListAll);

export default router;
 