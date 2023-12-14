import { Request, Response, Router } from "express";

import { deleteImage, generateDownloadUrl } from "../utils/s3/s3";

import multer from "multer";

import { db } from "../server";

import passport from "passport";
import { uploadImageController } from "../controllers/serviceControllers/serviceImageControllers/uploadImageController/uploadImageController";
import { getSignedImgUrlController } from "../controllers/serviceControllers/serviceImageControllers/getSignedImgUrlController/getSignedImgUrlController";
import updateImagesForServiceController from "../controllers/serviceControllers/serviceImageControllers/updateImagesForServiceController/updateImagesForServiceController";

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
router.delete("/:imageKey", async (req: Request, res: Response) => {
  try {
    const deleteResult = await deleteImage(req.params.imageKey);

    const deleteFromDB = await db
      .getImagesDB()
      .genericQueries.deleteBySingleCriteria("fileName", req.params.imageKey);

    return res.status(200).json({ deleteResult, deleteFromDB });
  } catch (error) {
    console.log(error, "error in delete image");
  }
});
router.post("/", upload.array("images", 5), uploadImageController);

export default router;
