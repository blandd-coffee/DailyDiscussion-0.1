import { Router } from "express";
import auth from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", auth.login);
router.get("/redirect", auth.redirect);
router.get("/me", auth.me);
router.post("/logout", auth.logout);

export default router;
