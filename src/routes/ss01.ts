import ClientRoutes from "./ss01/client";
import ProjectRoutes from "./ss01/project";
import AreaRoutes from "./ss01/area";
import SubAreaRoutes from "./ss01/subarea";
import MaterialRoutes from "./ss01/material";
import QuestionRoutes from "./ss01/question";
import ManpowerRoutes from "./ss01/manpower";
import ShiftRoutes from "./ss01/shift";
import ScaRoutes from "./ss01/sca";
import ComplainRoutes from "./ss01/complain";
import FrequencyRoutes from "./ss01/frequency";
import WorkingRoutes from "./ss01/working";
import TaskRoutes from "./ss01/task";
import TypeWorkingRoutes from "./ss01/typeWorking";
import MonitorFeedbackRoutes from "./feedback/monitor";
import DashboardRoutes from "./ss01/dashboard"

import express from "express";
import * as AuthMiddleware from "../middleware/auth";

const router = express.Router();

router.use("/client", AuthMiddleware.authUser, ClientRoutes);
router.use("/project", AuthMiddleware.authUser, ProjectRoutes);
router.use("/area", AuthMiddleware.authUser, AreaRoutes);
router.use("/subarea", AuthMiddleware.authUser, SubAreaRoutes);
router.use("/material", AuthMiddleware.authUser, MaterialRoutes);
router.use("/question", AuthMiddleware.authUser, QuestionRoutes);
router.use("/manpower", AuthMiddleware.authUser, ManpowerRoutes);
router.use("/shift", AuthMiddleware.authUser, ShiftRoutes);
router.use("/sca", AuthMiddleware.authUser, ScaRoutes);
router.use("/complain", AuthMiddleware.authUser, ComplainRoutes);
router.use("/frequency", AuthMiddleware.authUser, FrequencyRoutes);
router.use("/working", AuthMiddleware.authUser, WorkingRoutes);
router.use("/task", AuthMiddleware.authUser, TaskRoutes);
router.use("/type-working", AuthMiddleware.authUser, TypeWorkingRoutes);
router.use("/feedback", AuthMiddleware.authUser, MonitorFeedbackRoutes);
router.use("/dashboard",AuthMiddleware.authUser,DashboardRoutes)

export default router;
