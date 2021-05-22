import { Router } from "express";
import { checkAuth } from "../utils/checkAuth";
import postController from "../controllers/postController";

const router = Router();

router
  .route("/")
  .post(checkAuth, postController.createPost)
  .get(postController.getPosts);
router.get("/:identifier/:slug", postController.getPost);

export default router;
