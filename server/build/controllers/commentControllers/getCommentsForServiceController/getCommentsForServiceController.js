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
exports.getCommentsForServiceController = void 0;
const server_1 = require("../../../server");
const getCommentsForServiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user || req.user.privileges === "none")
        return res
            .status(403)
            .json("You do not have sufficient rights to access this");
    if (!req.query ||
        !req.query.serviceId ||
        typeof req.query.serviceId !== "string")
        return res
            .status(400)
            .json("Request body is not appropriate for fetching comments");
    let organisation = "";
    const { queryorg } = req.query;
    organisation = (_a = req.user.organisation) === null || _a === void 0 ? void 0 : _a.toString();
    if (req.user.organisation === "admin" && queryorg)
        organisation = (queryorg === null || queryorg === void 0 ? void 0 : queryorg.toString()) || "admin";
    const serviceId = parseInt(req.query.serviceId);
    if (typeof serviceId !== "number")
        return res.status(400).json("serviceId must be of type number");
    const queryOffset = parseInt(req.query.offset);
    const paramsToPass = {
        organisation,
        serviceId,
        limit: 5,
        offset: queryOffset ? queryOffset : 0,
    };
    if (req.query.parentCommentId &&
        typeof req.query.parentCommentId === "string" &&
        typeof parseInt(req.query.parentCommentId) === "number")
        paramsToPass.parentId = parseInt(req.query.parentCommentId);
    const result = yield server_1.db.getCommentsDB().fetchComments(paramsToPass);
    if (result instanceof Error)
        return res.status(500).json(result.message);
    res.status(200).json(result);
});
exports.getCommentsForServiceController = getCommentsForServiceController;
