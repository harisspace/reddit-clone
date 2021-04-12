import { Router } from "express";
import { checkAuth } from "../utils/checkAuth";
import postController from "../controllers/postController";

const router = Router();

router.post("/", checkAuth, postController.createPost);
router.get("/", postController.getPosts);
router.get("/:identifier/:slug", postController.getPost);

export default router;
