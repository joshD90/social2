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

router.get("/:key", async (req: Request, res: Response) => {
  const key = req.params.key;
  if (!key) return res.status(400).json("Needs a Key for the image");

  try {
    const url = await generateDownloadUrl(key);
    console.log(url, "url in public/key");
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post(
  "/",
  upload.array("images", 5),
  uploadImageController
  // async (req: Request, res: Response): Promise<Response> => {
  //   const files = req.files;
  //   try {
  //     const uploadResult = await uploadFile(file);
  //     console.log(uploadResult, "upload result");
  //     await db.getImagesDB().addImage({
  //       fileName: uploadResult.Key,
  //       url: uploadResult.Location,
  //       bucket_name: uploadResult.Bucket,
  //     });
  //     return res.status(200).json(uploadResult);
  //   } catch (error) {
  //     console.log(error, "error in post image endpoint");
  //     return res.status(500).json(error);
  //   }
  // }
);

export default router;
