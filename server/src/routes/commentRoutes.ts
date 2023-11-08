import { Router } from "express";
import passport from "passport";
import { createCommentController } from "../controllers/commentControllers/createCommentController/createCommentController";
import { getCommentsForServiceController } from "../controllers/commentControllers/getCommentsForServiceController/getCommentsForServiceController";
import { commentVoteController } from "../controllers/commentControllers/commentVoteController/commentVoteController";
import deleteCommentController from "../controllers/commentControllers/deleteCommentController/deleteCommentController";
import updateCommentController from "../controllers/commentControllers/updateCommentController/updateCommentController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createCommentController);
router.get("/", getCommentsForServiceController);
router.put("/:id", updateCommentController);
router.delete("/:commentId", deleteCommentController);
router.post("/vote", commentVoteController);

export default router;
