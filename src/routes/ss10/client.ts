import express from "express";
import * as ClientController from "../../controllers/ss10/client";

const router = express.Router();

router.get("/", ClientController.getAllList);

export default router;
