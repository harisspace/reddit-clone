import { Router } from "express";
import { checkAuth } from "../utils/authentication/checkAuth";
import postController from "../controllers/postController";
import { uploadImage } from "../utils/upload/uploadImage";

const router = Router();

router
  .route("/")
  .post(checkAuth, uploadImage.single("image"), postController.createPost)
  .get(postController.getPosts);
router.get("/:identifier/:slug", postController.getPost);

export default router;
