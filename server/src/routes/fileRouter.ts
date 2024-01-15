import { Router } from "express";
import passport from "passport";
import uploadServiceFileController from "../controllers/serviceControllers/serviceFileControllers/uploadServiceFileController/uploadServiceFileController";
import getSignedFileUrlController from "../controllers/serviceControllers/serviceFileControllers/getSignedFileUrlController/getSignedFileUrlController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", uploadServiceFileController);
router.get("/:serviceId", getSignedFileUrlController);
router.put("/", uploadServiceFileController);

export default router;
