import { Router } from "express";
import passport from "passport";

import createServiceReportController from "../controllers/serviceControllers/serviceReportControllers/createServiceReportController/createServiceReportController";
import findAllServiceReportController from "../controllers/serviceControllers/serviceReportControllers/findAllServiceReportController/findAllServiceReportController";
import findServiceReportController from "../controllers/serviceControllers/serviceReportControllers/findServiceReportController/findServiceReportController";
import updateServiceReportStatusController from "../controllers/serviceControllers/serviceReportControllers/updateServiceReportStatusController/updateServiceReportStatusController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createServiceReportController);
router.get("/", findAllServiceReportController);
router.get("/:id", findServiceReportController);
router.put("/status", updateServiceReportStatusController);

export default router;
