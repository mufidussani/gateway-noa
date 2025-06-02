import express from "express";
import * as ComplainController from "../../controllers/ss01/complain";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as ComplainValidator from "../../middleware/validations/ss01/complain";
const router = express.Router();

router.post(
  "/",
  ComplainValidator.createValidation(),
  ValidatorMiddleware.Validator,
  ComplainController.create
);

router.get("/", ComplainController.getAll);

router.put(
  "/:id",
  ComplainValidator.updateSolveValidationByID(),
  ValidatorMiddleware.Validator,
  ComplainController.updateSolvedByID
);

router.get("/:id", ComplainController.getByID);

router.get("/subarea/:id_subarea", ComplainController.getByIDSubarea);

router.get("/project/:id_project", ComplainController.getByIDProject);

router.put(
  "/action/:id",
  ComplainValidator.updateActionByIDValidation(),
  ValidatorMiddleware.Validator,
  ComplainController.updateActionByID
);

router.get("/action/:id", ComplainController.getActionByID);

export default router;
