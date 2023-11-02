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
const updateUserPrivilegesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user ||
        (req.user.privileges !== "moderator" &&
            req.user.privileges !== "admin"))
        return res
            .status(403)
            .json("You do not have the privileges to be adjusting other users privileges");
    const { userToUpdateId, newPrivilege } = req.body;
    if (typeof parseInt(userToUpdateId) !== "number" ||
        typeof newPrivilege !== "string")
        return res.status(400).json("Your req body is no in right format");
    //check is the user within the same organisation if being accessed by moderator
    const userToChange = yield server_1.db
        .getUserDB()
        .findUser(["users.id", userToUpdateId]);
    console.log(userToChange, "user to change in privielege controller");
    if (userToChange instanceof Error)
        return res.status(500).json(userToChange.message);
    if (req.user.privileges !== "admin" &&
        ((_a = userToChange[0]) === null || _a === void 0 ? void 0 : _a.organisation) !== req.user.organisation)
        return res
            .status(403)
            .json("You can only change the status within your own organisation");
    const result = yield server_1.db
        .getUserDB()
        .updatePrivileges(newPrivilege, parseInt(userToUpdateId));
    if (result instanceof Error)
        return res.status(500).json(result.message);
    console.log("successfully updated");
    return res.status(200).json("Updated Successfully");
});
exports.default = updateUserPrivilegesController;
