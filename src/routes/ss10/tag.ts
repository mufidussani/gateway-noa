import express from "express";
import * as TagController from "../../controllers/ss10/tag";
import * as ValidataorMiddleware from "../../middleware/validator";
import * as TagValidator from "../../middleware/validations/ss10/tag";

const router = express.Router();

router.post(
  "/",
  TagValidator.createValidation(),
  ValidataorMiddleware.Validator,
  TagController.create
);

router.get("/area/:id_area", TagController.getByIDArea);

router.get(
  "/list/deactive/area/:id_area",
  TagController.getListDeactiveByIDArea
);

export default router;
