import { Router } from "express";
import discussionsController from "../controllers/discussions.controller.js";

const router = Router();

router.get("/", discussionsController.getScheduledDiscusion);
router.get("/unscheduled", discussionsController.getUnscheduledDiscussions);
router.get("/all", discussionsController.getAllScheduledDiscussions);
router.get("/:id", discussionsController.getDiscussionById);

router.post("/", discussionsController.postDiscussion);
router.put("/", discussionsController.updateDiscussion);

export default router;
