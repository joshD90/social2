import { Request, Response, Router } from "express";

import { deleteImage } from "../utils/AWS/s3/s3";

import multer from "multer";

import { db } from "../server";

import passport from "passport";
import { uploadImageController } from "../controllers/serviceControllers/serviceImageControllers/uploadImageController/uploadImageController";
import { getSignedImgUrlController } from "../controllers/serviceControllers/serviceImageControllers/getSignedImgUrlController/getSignedImgUrlController";
import updateImagesForServiceController from "../controllers/serviceControllers/serviceImageControllers/updateImagesForServiceController/updateImagesForServiceController";
import deleteImageController from "../controllers/serviceControllers/serviceImageControllers/deleteImageController/deleteImageController";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(passport.authenticate("jwt", { session: false }));

router.get("/:serviceId", getSignedImgUrlController);
router.put(
  "/:serviceId",
  upload.array("images", 5),
  updateImagesForServiceController
);
router.delete("/:imageKey", deleteImageController);
router.post("/:serviceId", upload.array("images", 5), uploadImageController);

export default router;
