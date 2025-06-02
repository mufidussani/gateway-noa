import express from "express";
import * as TypeWorkingController from "../../controllers/ss01/typeWorking";

const router = express.Router();

router.get("/", TypeWorkingController.getAll);

export default router;
