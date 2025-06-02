import PresenceRoutes from "./presence/presence"
import express from "express";
import * as AuthMiddleware from "../middleware/auth";

const router = express.Router();

router.use("/",AuthMiddleware.authUser,PresenceRoutes)

export default router;