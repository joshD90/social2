import { Request, Response, Router } from "express";

import { generateDownloadUrl } from "../utils/s3/s3";

import multer from "multer";

import { db } from "../server";

import passport from "passport";
import { uploadImageController } from "../controllers/serviceControllers/serviceImageControllers/uploadImageController/uploadImageController";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(passport.authenticate("jwt", { session: false }));

router.get("/:serviceId", async (req: Request, res: Response) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    const signedUrls = await db
      .getImagesDB()
      .getImageSignedUrlsByService(serviceId);
    res.status(200).json({ urls: signedUrls });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", upload.array("images", 5), uploadImageController);

export default router;
