import express from "express";
import * as AuthMiddleware from "../middleware/auth";
import * as SS04Controller from "../controllers/ss04"

const router = express.Router();

router.get("/",AuthMiddleware.authUser,SS04Controller.get)

export default router;
