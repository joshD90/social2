import express from "express";

import createServiceController from "../controllers/serviceControllers/createServiceController";
import { findServiceByIdController } from "../controllers/serviceControllers/findServiceByIdController";
import { findServicesByCategory } from "../controllers/serviceControllers/findServiceByCategory";
import { findAllInSubCategory } from "../controllers/serviceControllers/findAllInSubCategory";
import getAllServicesController from "../controllers/serviceControllers/getAllServicesController";
import deleteServiceByIdController from "../controllers/serviceControllers/deleteServiceByIdController";
import updateServiceController from "../controllers/serviceControllers/updateServiceController";
import passport from "passport";
import createServiceReportController from "../controllers/serviceControllers/serviceReportControllers/createServiceReportController/createServiceReportController";
import findAllServiceReportController from "../controllers/serviceControllers/serviceReportControllers/findAllServiceReportController/findAllServiceReportController";
import findServiceReportController from "../controllers/serviceControllers/serviceReportControllers/findServiceReportController/findServiceReportController";

const router = express.Router();

router.get("/", getAllServicesController);
router.get("/:category", findServicesByCategory);
router.delete(
  "/:serviceId",
  passport.authenticate("jwt", { session: false }),
  deleteServiceByIdController
);
router.post(
  "/service/reports",
  passport.authenticate("jwt", { session: false }),
  createServiceReportController
);
//do i need to change the typings for the name space of express
router.get(
  "/service/reports",
  passport.authenticate("jwt", { session: false }),
  findAllServiceReportController
);
router.get(
  "service/reports/:id",
  passport.authenticate("jwt", { session: false }),
  findServiceReportController
);
router.get("/service/:serviceId", findServiceByIdController);
router.get("/subCategories/:subCategory", findAllInSubCategory);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createServiceController
);
router.put(
  "/:serviceId",
  passport.authenticate("jwt", { session: false }),
  updateServiceController
);

export default router;
