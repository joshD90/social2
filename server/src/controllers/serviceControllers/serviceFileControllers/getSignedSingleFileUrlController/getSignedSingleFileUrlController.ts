import { Request, Response } from "express";
import { db } from "../../../../server";

const getSignedSingleFileUrlController = async (
  req: Request,
  res: Response
) => {
  console.log("I have hit the single file url contoller");
  if (!req.user)
    return res
      .status(403)
      .json("You do not have permission to access this resource");

  const fileId = parseInt(req.params.fileId);
  if (!fileId || isNaN(fileId))
    return res.status(400).json("Url needs to be of type string");

  try {
    const signedUrl = await db
      .getServiceFilesDB()
      .getFileSignedUrlByColumn("id", fileId);
    console.log(signedUrl, "signed url");
    if (!signedUrl) return res.status(404).json("No File Matches this url");
    return res.status(200).json(signedUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json((error as Error).message);
  }
};

export default getSignedSingleFileUrlController;
