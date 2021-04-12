import { Router } from "express";
import subController from "../controllers/subController";
import { checkAuth } from "../utils/checkAuth";

const router = Router();

router.post("/", checkAuth, subController.createSub);

export default router;
