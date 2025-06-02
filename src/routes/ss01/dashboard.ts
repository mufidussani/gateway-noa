import express from "express";
import * as DashboardController from "../../controllers/ss01/dashboard";

const router = express.Router();

router.get("/project/:id_project", DashboardController.getByIDProject);

router.get(
  "/project-date/:id_project",
  DashboardController.getByDateRangeIDProject
);

router.get(
  "/rank-subarea/bad/:id_project",
  DashboardController.getRankBADByIDProject
);

router.get(
  "/rank-subarea/good/:id_project",
  DashboardController.getRankGOODByIDProject
);

export default router;
