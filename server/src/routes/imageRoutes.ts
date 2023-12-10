import { Request, Response, Router } from "express";

import { generateDownloadUrl, generateUploadURL } from "../utils/s3/s3";

import multer from "multer";
import { getFileStream, uploadFile } from "../utils/s3/s3Server";
import { db } from "../server";
import { createReadStream, read } from "fs";

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

router.get("/public/:key", async (req: Request, res: Response) => {
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

router.get("/:key", async (req: Request, res: Response) => {
  console.log("hit the image getter endpoint");
  const key = req.params.key;
  if (!key) return res.status(400).json("Needs an id in parameters");
  const readStream = getFileStream(key);
  readStream.pipe(res);
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
        bucket_name: uploadResult.Bucket,
      });
      return res.status(200).json(uploadResult);
    } catch (error) {
      console.log(error, "error in post image endpoint");
      return res.status(500).json(error);
    }
  }
);

export default router;
