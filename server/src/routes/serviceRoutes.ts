import express from "express";
import passport from "passport";

import serviceReportRouter from "./serviceReportRoutes";
import serviceCommentRouter from "./commentRoutes";
import imageRouter from "./imageRoutes";

import createServiceController from "../controllers/serviceControllers/createServiceController";
import { findServiceByIdController } from "../controllers/serviceControllers/findServiceByIdController";
import { findServicesByCategory } from "../controllers/serviceControllers/findServiceByCategory";
import { findAllInSubCategory } from "../controllers/serviceControllers/findAllInSubCategory";
import getAllServicesController from "../controllers/serviceControllers/getAllServicesController";
import deleteServiceByIdController from "../controllers/serviceControllers/deleteServiceByIdController";
import updateServiceController from "../controllers/serviceControllers/updateServiceController";

const router = express.Router();

router.use("/service/reports", serviceReportRouter);
router.use("/service/comments", serviceCommentRouter);
router.use("/images", imageRouter);

router.get("/", getAllServicesController);
router.get("/:category", findServicesByCategory);
router.delete(
  "/:serviceId",
  passport.authenticate("jwt", { session: false }),
  deleteServiceByIdController
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
