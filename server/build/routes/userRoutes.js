"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const updateUserPrivilegesController_1 = __importDefault(require("../controllers/userControllers/updateUserPrivileges/updateUserPrivilegesController"));
const getUsersController_1 = __importDefault(require("../controllers/userControllers/getUsersController/getUsersController"));
const getAllUserOrganisationsController_1 = require("../controllers/userControllers/getAllUserOrganisationsController/getAllUserOrganisationsController");
const router = (0, express_1.Router)();
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.get("/", getUsersController_1.default);
router.get("/organisations", getAllUserOrganisationsController_1.getAllUserOrganisationsController);
router.put("/privileges", updateUserPrivilegesController_1.default);
exports.default = router;
