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
exports.commentVoteController = void 0;
const server_1 = require("../../../server");
const commentVoteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.privileges === "none")
        return res.status(401).json("Need to be logged in to vote");
    const voteToPass = validateVote(req.body);
    if (!voteToPass)
        return res.status(400).json("Request body is not in right format");
    try {
        const result = yield server_1.db.getCommentsDB().voteComment(voteToPass);
        if (result instanceof Error)
            throw Error(result.message);
        return res.status(200).json("Vote Successfully recorded");
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});
exports.commentVoteController = commentVoteController;
const validateVote = (reqBody) => {
    if (!(reqBody instanceof Object))
        return false;
    if (!reqBody.hasOwnProperty("commentId") ||
        !reqBody.hasOwnProperty("userId") ||
        !reqBody.hasOwnProperty("voteValue"))
        return false;
    const partialValidate = reqBody;
    if (typeof partialValidate.commentId === "number" &&
        typeof partialValidate.userId === "number" &&
        typeof partialValidate.voteValue === "number")
        return {
            commentId: partialValidate.commentId,
            userId: partialValidate.userId,
            voteValue: partialValidate.voteValue,
        };
    return false;
};
