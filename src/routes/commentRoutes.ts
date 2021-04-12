import { Router } from "express";
import commentController from "../controllers/commentController";
import { checkAuth } from "../utils/checkAuth";

const router = Router();

router.post("/", checkAuth, commentController.createComment);

export default router;
