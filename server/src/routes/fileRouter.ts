import { Router } from "express";
import passport from "passport";
import uploadServiceFileController from "../controllers/serviceControllers/serviceFileControllers/uploadServiceFileController/uploadServiceFileController";
import getSignedFileUrlController from "../controllers/serviceControllers/serviceFileControllers/getSignedFileUrlController/getSignedFileUrlController";
import updateServiceFileController from "../controllers/serviceControllers/serviceFileControllers/updateServiceFileController/updateServiceFileController";
import multer from "multer";
import getSignedSingleFileUrlController from "../controllers/serviceControllers/serviceFileControllers/getSignedSingleFileUrlController/getSignedSingleFileUrlController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("files", 5), uploadServiceFileController);
router.get("/signed/:fileId", getSignedSingleFileUrlController);
router.get("/:serviceId", getSignedFileUrlController);
router.put("/", upload.array("files", 5), updateServiceFileController);

export default router;
