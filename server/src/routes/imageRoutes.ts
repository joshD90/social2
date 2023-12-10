import { Request, Response, Router } from "express";

import { generateUploadURL } from "../utils/s3/s3";

import multer from "multer";
import { uploadFile } from "../utils/s3/s3Server";
import { db } from "../server";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/s3url", async (req: Request, res: Response) => {
  console.log("You have looked for the secure url");
  try {
    const url = await generateUploadURL();
    console.log(url, "magic url");
    res.status(200).send(url);
  } catch (error) {
    console.log(error, "error in imageRoutes");
    return res.status(500).json(error);
  }
});
router.get("/", (req: Request, res: Response) => {
  console.log("You have hit get endpoint");
});
router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response): Promise<Response> => {
    const file = req.file;
    try {
      const uploadResult = await uploadFile(file);
      console.log(uploadResult, "upload result");
      await db.getImagesDB().addImage({
        fileName: uploadResult.Key,
        url: uploadResult.Location,
      });
      return res.status(200).json(uploadResult);
    } catch (error) {
      console.log(error, "error in post image endpoint");
      return res.status(500).json(error);
    }
  }
);

export default router;
