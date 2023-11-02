"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../../server");
const deleteCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.user)
        return res.status(401).json("Need to be logged in to perform this action");
    const commentId = req.body.commentId;
    if (!commentId)
        return res.status(400).json("Needs a commentId to delete the comment");
    const commentToDelete = yield server_1.db
        .getCommentsDB()
        .getCommentsGeneric()
        .findEntryBy("id", commentId);
    if (!commentToDelete || commentToDelete instanceof Error)
        return res.status(404).json("Could not find this comment to delete");
    if (req.user.privileges === "admin")
        return handleDeleteHelper(res, commentId);
    if (req.user.privileges === "moderator" &&
        req.user.organisation === ((_a = commentToDelete[0]) === null || _a === void 0 ? void 0 : _a.organisation))
        return handleDeleteHelper(res, commentId);
    if (req.user.privileges === "approved" &&
        req.user.id === ((_b = commentToDelete[0]) === null || _b === void 0 ? void 0 : _b.user_id))
        return handleDeleteHelper(res, commentId);
    return res
        .status(403)
        .json("You do not have permission to delete this comment");
});
const handleDeleteHelper = (res, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield server_1.db.getCommentsDB().deleteComment(commentId);
    if (deleteResult instanceof Error)
        return res.status(500).json(deleteResult.message);
    return res.status(200).json("Deleted Successfully");
});
exports.default = deleteCommentController;
