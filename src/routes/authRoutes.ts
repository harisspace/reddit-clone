import { Router } from "express";
import authController from "../controllers/authController";
import { checkAuth } from "../utils/checkAuth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", checkAuth, authController.me);
router.get("/logout", checkAuth, authController.logout);

export default router;
