import express from "express";
import * as FeedBackController from "../../controllers/feedback/feedback";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as FeedBackValidator from "../../middleware/validations/feedback/feedback";
import * as AreaController from "../../controllers/ss01/area";
import * as SubAreaController from "../../controllers/ss01/subarea";


const router = express.Router();

router.post(
  "/",
  FeedBackValidator.createValidation(),
  ValidatorMiddleware.Validator,
  FeedBackController.create
);

router.get("/area-list/:id_project", FeedBackController.getAreaByIDProject);

router.get("/subarea-list/:id_area", FeedBackController.getSubareaByIDArea);

export default router;
