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
exports.getAllUserOrganisationsController = void 0;
const server_1 = require("../../../server");
const getAllUserOrganisationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.privileges !== "admin")
        return res
            .status(403)
            .json("You do not have the privileges to access this endpoint");
    const organisationNames = yield server_1.db.getUserDB().getAllOrganisations();
    if (organisationNames instanceof Error)
        return res.status(500).json(organisationNames.message);
    return res.status(200).json(organisationNames);
});
exports.getAllUserOrganisationsController = getAllUserOrganisationsController;
