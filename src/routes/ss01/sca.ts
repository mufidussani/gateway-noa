import express from "express";
import * as ScaController from "../../controllers/ss01/sca";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as ScaValidator from "../../middleware/validations/ss01/sca";
const router = express.Router();

// router.post(
//   "/",
//   ScaValidator.createValidation(),
//   ValidatorMiddleware.Validator,
//   ScaController.create
// );

router.get("/", ScaController.getAll);

router.get("/detail/:id_sca", ScaController.getDetailByIDSca);

router.get("/unsolve", ScaController.getUnsolve);

router.put(
  "/unsolve/:id",
  ScaValidator.updateUnsolveByIDValidation(),
  ValidatorMiddleware.Validator,
  ScaController.updateUnsolveByID
);

router.get("/detail/task/:id_task", ScaController.getDetailByIDTask);

router.put(
  "/detail/action/before/:id",
  ScaValidator.updateImageActionBeforeValidation(),
  ValidatorMiddleware.Validator,
  ScaController.updateImageActionBeforeByID
);

router.put(
  "/detail/action/after/:id",
  ScaValidator.updateImageActionAfterValidataion(),
  ValidatorMiddleware.Validator,
  ScaController.updateImageActionAfterByID
);

router.get("/detail-check/task/:id_task", ScaController.getDetailCheckByIDTask);

router.put(
  "/detail/result/:id",
  ScaValidator.updateResultCheckValidation(),
  ValidatorMiddleware.Validator,
  ScaController.updateResultCheckByID
);

router.get("/area/:id_area", ScaController.getByIDArea);

export default router;
