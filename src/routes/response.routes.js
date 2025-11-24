import { Router } from "express";
import responseController from "../controllers/response.controller.js";

const router = Router();

router.get("/", responseController.getResponses);
router.get("/user/:id", responseController.getResponsesByUser);
router.get("/replies", responseController.getReplies);
router.get("/all/:id", responseController.getAllResponsesByUser);

router.post("/", responseController.postNewResponse);
router.post("/replies", responseController.postNewReply);

export default router;
