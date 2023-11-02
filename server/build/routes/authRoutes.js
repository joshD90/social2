"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authSignupController_1 = __importDefault(require("../controllers/authControllers/authSignupController"));
const passport_1 = __importDefault(require("passport"));
const authSigninController_1 = __importDefault(require("../controllers/authControllers/authSigninController"));
const authSignOutController_1 = __importDefault(require("../controllers/authControllers/authSignOutController"));
const userDataController_1 = __importDefault(require("../controllers/authControllers/userDataController"));
const router = (0, express_1.Router)();
router.post("/signup", authSignupController_1.default);
router.post("/signin", passport_1.default.authenticate("local", { session: false }), authSigninController_1.default);
router.get("/signout", authSignOutController_1.default);
router.get("/user-data", passport_1.default.authenticate("jwt", { session: false }), userDataController_1.default);
exports.default = router;
