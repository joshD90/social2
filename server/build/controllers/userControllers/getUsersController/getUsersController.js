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
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user ||
        (req.user.privileges !== "admin" &&
            req.user.privileges !== "moderator"))
        return res.status(403).json("You do not have sufficient privileges");
    let organisation = ((_a = req.query.organisation) === null || _a === void 0 ? void 0 : _a.toString()) || null;
    try {
        if (req.user.privileges === "admin" && !organisation) {
            const result = yield server_1.db.getUserDB().getAllUsers();
            if (result instanceof Error)
                throw Error(result.message);
            return res.status(200).json(result);
        }
        else {
            if (!organisation)
                organisation = req.user.organisation.toString();
            const result = yield server_1.db
                .getUserDB()
                .findUser(["organisation", organisation]);
            if (result instanceof Error)
                throw Error(result.message);
            return res.status(200).json(result);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.default = getUsersController;
