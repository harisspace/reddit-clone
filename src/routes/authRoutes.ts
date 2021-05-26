import { Router } from "express";
import authController from "../controllers/authController";
import { checkAuth } from "../utils/authentication/checkAuth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", checkAuth, authController.me);
router.get("/logout", checkAuth, authController.logout);
router.get("/confirmation/sendEmail", authController.resendEmail);
router.get("/confirmation/:token", authController.confirmation);
// OAuth
// router.get("/login/google", (req, res) => {

// })

export default router;
