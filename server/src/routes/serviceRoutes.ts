import express from "express";

import createServiceController from "../controllers/serviceControllers/createServiceController";
import { findServiceByIdController } from "../controllers/serviceControllers/findServiceByIdController";
import { findServicesByCategory } from "../controllers/serviceControllers/findServiceByCategory";
import { findAllInSubCategory } from "../controllers/serviceControllers/findAllInSubCategory";

const router = express.Router();

router.get("/:category", findServicesByCategory);
router.get("/service/:serviceId", findServiceByIdController);
router.get("/subCategories/:subCategory", findAllInSubCategory);
router.post("/", createServiceController);

export default router;
