import { Request, Response } from "express";
import { db } from "../../../../server";

export const getSignedImgUrlController = async (
  req: Request,
  res: Response
) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    const signedUrls = await db
      .getImagesDB()
      .getImageSignedUrlsByService(serviceId);

    res.status(200).json({ urls: signedUrls });
  } catch (error) {
    console.log(error);
    res.status(500).json((error as Error).message);
  }
};
