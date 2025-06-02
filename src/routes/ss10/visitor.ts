import express from "express";
import * as VisitorController from "../../controllers/ss10/visitor";
import * as ValidatorMiddleware from "../../middleware/validator";
import * as VisitorValidator from "../../middleware/validations/ss10/visitor";

const router = express.Router();

router.post(
    "/",
    VisitorValidator.createValidation(),
    ValidatorMiddleware.Validator,
    VisitorController.create
)

router.get("/client/:id_client", VisitorController.gertByIdClient)

export default router;