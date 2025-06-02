import express from "express";
import * as MaterialFeedbackController from "../../controllers/feedback/material"

const router = express.Router()

router.get("/list",MaterialFeedbackController.getListAll)

export default router
