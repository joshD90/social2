import express from "express";

import { Request, Response } from "express";
import createServiceController from "../controllers/serviceControllers/createServiceController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  console.log("You have reached the endpoint for service route");
  res.status(200).send("You have reached the service home end point");
});
router.post("/", createServiceController);

export default router;
