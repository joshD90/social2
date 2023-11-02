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
exports.createCommentController = void 0;
const server_1 = require("../../../server");
const createCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.hasOwnProperty("id"))
        return res.status(403).json("Need to be Logged In");
    console.log(req.user, "req.user");
    console.log(req.body, "reqbody");
    if (req.user.privileges === "none")
        return res
            .status(403)
            .json("You do not have sufficient rights to access this");
    const preparedObject = convertToSQLReady(req.body);
    console.log(preparedObject, "prepared object");
    if (!preparedObject)
        return res.status(400).json("Data sent over is incorrect");
    if (req.user.id !== preparedObject.user_id)
        return res.status(403).json("You can only write comments in your own name");
    const result = yield server_1.db.getCommentsDB().createNewComment(preparedObject);
    if (result instanceof Error)
        return res.status(500).json("There was a problem in creating your comment");
    return res.status(201).json({ newId: result });
});
exports.createCommentController = createCommentController;
const convertToSQLReady = (reqBody) => {
    const preparedObject = {};
    if (!reqBody)
        return false;
    if (!(reqBody instanceof Object))
        return false;
    if (!reqBody.hasOwnProperty("user_id") ||
        !reqBody.hasOwnProperty("comment") ||
        !reqBody.hasOwnProperty("service_id"))
        return false;
    if (typeof reqBody.user_id !== "number")
        return false;
    if (typeof reqBody.service_id !== "number")
        return false;
    if (typeof reqBody.comment !== "string")
        return false;
    preparedObject.user_id = reqBody.user_id;
    preparedObject.service_id = reqBody.service_id;
    preparedObject.comment = reqBody.comment;
    if (reqBody.hasOwnProperty("inReplyTo") &&
        typeof reqBody.inReplyTo === "number")
        preparedObject.inReplyTo = reqBody.inReplyTo;
    return preparedObject;
};
