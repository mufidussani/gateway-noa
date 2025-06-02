import express from "express";
import * as WorkingController from "../../controllers/ss01/working";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as WorkingValidator from "../../middleware/validations/ss01/working";
const router = express.Router();

router.post(
  "/",
  WorkingValidator.createValidation(),
  ValidatorMiddleware.Validator,
  WorkingController.create
);

router.get("/area-date/:id_area", WorkingController.getByIDAreaDate);

router.get("/area/:id_area", WorkingController.getByIDArea);

router.get(
  "/area-date-manpower/:id_area",
  WorkingController.getByIDAreaDateIDManpower
);

router.post(
  "/daily",
  WorkingValidator.createDailyValidation(),
  ValidatorMiddleware.Validator,
  WorkingController.createDaily
);

router.get(
  "/area-daily-agent/:id_area",
  WorkingController.getDailyByIDAreaIDAgent
);

router.get(
  "/history-area-daily-agent/:id_area",
  WorkingController.getHistoryDailyByIDAreaIDAgent
);

export default router;
