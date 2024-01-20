import { Request, Response } from "express";
import { db } from "../../../../server";

export const getSignedImgUrlController = async (
  req: Request,
  res: Response
) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    console.log("hitting endpoint for signed img urls");
    const signedUrls = await db
      .getImagesDB()
      .getImageSignedUrlsByService(serviceId);
    console.log(signedUrls, "signed urls in img url controller");
    res.status(200).json({ urls: signedUrls });
  } catch (error) {
    console.log(error);
    res.status(500).json((error as Error).message);
  }
};
