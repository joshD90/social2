"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const createCommentController_1 = require("../controllers/commentControllers/createCommentController/createCommentController");
const getCommentsForServiceController_1 = require("../controllers/commentControllers/getCommentsForServiceController/getCommentsForServiceController");
const commentVoteController_1 = require("../controllers/commentControllers/commentVoteController/commentVoteController");
const deleteCommentController_1 = __importDefault(require("../controllers/commentControllers/deleteCommentController/deleteCommentController"));
const router = (0, express_1.Router)();
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.post("/", createCommentController_1.createCommentController);
router.get("/", getCommentsForServiceController_1.getCommentsForServiceController);
router.delete("/", deleteCommentController_1.default);
router.post("/vote", commentVoteController_1.commentVoteController);
exports.default = router;
