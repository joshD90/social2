import { Request, Response } from "express";
import { db } from "../../../../server";

const getSignedFileUrlController = async (req: Request, res: Response) => {
  const serviceId = parseInt(req.params.serviceId);
  if (isNaN(serviceId))
    return res.status(400).json("Service Id should be of type integer");
  try {
    const signedUrls = await db
      .getServiceFilesDB()
      .getFilesSignedUrlsByService(serviceId);

    return res.status(200).json({ fileUrls: signedUrls });
  } catch (error) {
    console.log(error);
    res.status(500).json((error as Error).message);
  }
};

export default getSignedFileUrlController;
