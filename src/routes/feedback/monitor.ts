import express from "express";
import * as FeedBackController from "../../controllers/feedback/feedback";

const router = express.Router();

router.get("/total-list/:id_project", FeedBackController.getTotalByIDProject);

router.get(
  "/graph-year/:id_project",
  FeedBackController.getGraphYearNowByIDProject
);

router.get("/project/:id_project", FeedBackController.getByIDProject);

router.get(
  "/graph-month/:id_project",
  FeedBackController.getGraphBadByMonthByIDProject
);

router.get(
  "/graph-month-subarea/:id_subarea",
  FeedBackController.getGraphBadByMonthByIDSubarea
);

export default router;
