import express from "express";

import createServiceController from "../controllers/serviceControllers/createServiceController";
import { findServiceByIdController } from "../controllers/serviceControllers/findServiceByIdController";
import { findServicesByCategory } from "../controllers/serviceControllers/findServiceByCategory";

const router = express.Router();

router.get("/:category", findServicesByCategory);
router.get("/service/:serviceId", findServiceByIdController);
router.post("/", createServiceController);

export default router;
