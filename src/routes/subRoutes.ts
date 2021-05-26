import { Router } from "express";
import subController, {
  ownSub,
  uploadSubImage,
} from "../controllers/subController";
import { checkAuth } from "../utils/authentication/checkAuth";
import { uploadImage } from "../utils/upload/uploadImage";

const router = Router();

// create community
router.post("/", checkAuth, subController.createSub);
router.get("/:name", checkAuth, subController.getSub);
router.post(
  "/:name/image",
  checkAuth,
  ownSub,
  uploadImage.single("file"),
  uploadSubImage
);
// join community
router.post("/:name/join", checkAuth, subController.joinSub);

export default router;
