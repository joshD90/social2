"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const createServiceReportController_1 = __importDefault(require("../controllers/serviceControllers/serviceReportControllers/createServiceReportController/createServiceReportController"));
const findAllServiceReportController_1 = __importDefault(require("../controllers/serviceControllers/serviceReportControllers/findAllServiceReportController/findAllServiceReportController"));
const findServiceReportController_1 = __importDefault(require("../controllers/serviceControllers/serviceReportControllers/findServiceReportController/findServiceReportController"));
const updateServiceReportStatusController_1 = __importDefault(require("../controllers/serviceControllers/serviceReportControllers/updateServiceReportStatusController/updateServiceReportStatusController"));
const router = (0, express_1.Router)();
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.post("/", createServiceReportController_1.default);
router.get("/", findAllServiceReportController_1.default);
router.get("/:id", findServiceReportController_1.default);
router.put("/status", updateServiceReportStatusController_1.default);
exports.default = router;
