import { Router } from "express";
import passport from "passport";
import { createCommentController } from "../controllers/commentControllers/createCommentController/createCommentController";
import { getCommentsForServiceController } from "../controllers/commentControllers/getCommentsForServiceController/getCommentsForServiceController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createCommentController);
router.get("/", getCommentsForServiceController);

export default router;
