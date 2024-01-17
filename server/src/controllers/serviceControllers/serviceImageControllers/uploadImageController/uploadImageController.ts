import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";

import { uploadFileAndSaveDB } from "../../serviceFileControllers/uploadFileAndSaveDB/uploadFileAndSaveDB";
import { db } from "../../../../server";

export const uploadImageController = async (req: Request, res: Response) => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(401)
      .json("You are not authorised to access this endpoint");

  if (!req.files || !Array.isArray(req.files) || !req.body.service_id)
    return res
      .status(500)
      .json(
        "No Files Uploaded there was an issue with multer or no service id provided"
      );

  const service_id = parseInt(req.params.serviceId) ?? null;
  const mainPicIndex = req.body.mainPicIndex ?? null;

  const mainPicFileName = req.files[mainPicIndex]?.originalname;

  const currentDatabase = db.getServiceFilesDB();

  try {
    const resultsArray = await uploadFileAndSaveDB(
      req.files,
      service_id,
      currentDatabase,
      mainPicFileName
    );

    res.status(201).json({ imageDBEntries: resultsArray });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
