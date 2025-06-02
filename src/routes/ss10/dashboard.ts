import express from "express";
import * as DashboardController from "../../controllers/ss10/dashboard";

const router = express.Router();

router.get("/project/:id_project", DashboardController.getTotalDataByIDProject);

export default router;