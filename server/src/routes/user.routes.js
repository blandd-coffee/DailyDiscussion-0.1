import usersController from "../controllers/users.controller.js";
import { Router } from "express";

const router = Router();
router.get("/", usersController.getCurrentUser);
router.get("/all", usersController.getAllUsers);
router.get("/:ID", usersController.getUsersByID);
router.get("/search", usersController.getUserByName);
router.put("/", usersController.disableUser);

export default router;
