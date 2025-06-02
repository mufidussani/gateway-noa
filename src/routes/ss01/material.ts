import express from "express";
import * as MaterialController from "../../controllers/ss01/material";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as MaterialValidator from "../../middleware/validations/ss01/material";

const router = express.Router();

router.post(
  "/",
  MaterialValidator.createValidation(),
  ValidatorMiddleware.Validator,
  MaterialController.create
);

router.get("/", MaterialController.getAll);
router.get("/:id", MaterialController.getByID);

router.put(
  "/:id",
  MaterialValidator.createValidation(),
  ValidatorMiddleware.Validator,
  MaterialController.updateByID
);

router.delete("/:id", MaterialController.deleteMaterialById);

router.get("/list/all", MaterialController.getListAll);

export default router;
