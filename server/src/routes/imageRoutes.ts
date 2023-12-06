import { Request, Response, Router } from "express";
import { generateUploadURL } from "../utils/s3/s3";

const router = Router();

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
router.post("/", (req: Request, res: Response) => {
  console.log("You have hit the post endpoint");
});

export default router;
