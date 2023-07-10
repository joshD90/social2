import express from "express";

import createServiceController from "../controllers/serviceControllers/createServiceController";
import { findServiceByIdController } from "../controllers/serviceControllers/findServiceByIdController";

const router = express.Router();

router.get("/:serviceId", findServiceByIdController);
router.post("/", createServiceController);

export default router;
