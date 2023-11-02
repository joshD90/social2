import { Router } from "express";
import passport from "passport";
import { createCommentController } from "../controllers/commentControllers/createCommentController/createCommentController";
import { getCommentsForServiceController } from "../controllers/commentControllers/getCommentsForServiceController/getCommentsForServiceController";
import { commentVoteController } from "../controllers/commentControllers/commentVoteController/commentVoteController";
import deleteCommentController from "../controllers/commentControllers/deleteCommentController/deleteCommentController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createCommentController);
router.get("/", getCommentsForServiceController);
router.delete("/", deleteCommentController);
router.post("/vote", commentVoteController);

export default router;
