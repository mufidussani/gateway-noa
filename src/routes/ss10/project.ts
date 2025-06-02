import express from "express";
import * as ProjectController from "../../controllers/ss10/project";

const router = express.Router();

router.get("/:id_client", ProjectController.getListByIdClient);

export default router;
