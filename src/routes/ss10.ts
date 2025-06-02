import ClientRoutes from "./ss10/client";
import ProjectRoutes from "./ss10/project";
import AreaRoutes from "./ss10/area";
import SubAreaRoutes from "./ss10/subarea";
import CategoryRoutes from "./ss10/category";
import TagRoutes from "./ss10/tag";
import TourRoutes from "./ss10/tour";
import TemuanRoutes from "./ss10/temuan";
import IncidentRoutes from "./ss10/incident";
import VisitorRoutes from "./ss10/visitor";
import ShiftRoutes from "./ss10/shift";
import DashboardRoutes from "./ss10/dashboard";
import express from "express";
import * as AuthMiddleware from "../middleware/auth";
import * as ValidatorMiddleware from "../middleware/validator";

const router = express.Router();

router.use("/client", AuthMiddleware.authUser, ClientRoutes);
router.use("/project", AuthMiddleware.authUser, ProjectRoutes);
router.use("/area", AuthMiddleware.authUser, AreaRoutes);
router.use("/subarea", AuthMiddleware.authUser, SubAreaRoutes);
router.use("/category", AuthMiddleware.authUser, CategoryRoutes);
router.use("/tag", AuthMiddleware.authUser, TagRoutes);
router.use("/tour", AuthMiddleware.authUser, TourRoutes);
router.use("/temuan", AuthMiddleware.authUser, TemuanRoutes);
router.use("/incident", AuthMiddleware.authUser, IncidentRoutes);
router.use("/visitor", AuthMiddleware.authUser, VisitorRoutes);
router.use("/shift", AuthMiddleware.authUser, ShiftRoutes);
router.use("/dashboard", AuthMiddleware.authUser, DashboardRoutes);

export default router;
