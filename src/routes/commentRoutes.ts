import { Router } from "express";
import commentController from "../controllers/commentController";
import { checkAuth } from "../utils/authentication/checkAuth";

const router = Router();

router.post("/", checkAuth, commentController.commentOnPost);

export default router;
