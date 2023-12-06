import { Request, Response, Router } from "express";

const router = Router();

router.get("/s3url", (req: Request, res: Response) => {
  console.log("You have looked for the secure url");
});
router.get("/", (req: Request, res: Response) => {
  console.log("You have hit get endpoint");
});
router.post("/", (req: Request, res: Response) => {
  console.log("You have hit the post endpoint");
});

export default router;
