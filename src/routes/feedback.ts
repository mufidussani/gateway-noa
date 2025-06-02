import FeedbackRoutes from "./feedback/feedback";
import MaterialFeedbackRoutes from "./feedback/material";
import express from "express";
import * as AuthMiddleware from "../middleware/auth";

const router = express.Router();

router.use("/", AuthMiddleware.authFeedBack, FeedbackRoutes);
router.use("/material", AuthMiddleware.authFeedBack, MaterialFeedbackRoutes);

export default router;
