import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { uploadFile } from "../../../../utils/AWS/s3/s3";
import { db } from "../../../../server";

const uploadServiceFileController = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user || user.privileges !== "admin")
    return res
      .status(403)
      .json(
        "You are not permitted to upload files as you do not have the correct privileges"
      );
  try {
    if (!req.files || !Array.isArray(req.files) || !req.body.service_id)
      return res
        .status(500)
        .json(
          "No Files Uploaded there was an issue with multer or no service id provided"
        );
    const uploadResultsArray = await Promise.all(
      req.files.map((file) => uploadFile(file))
    );

    const dbInsertResultsArray = await Promise.all(
      uploadResultsArray.map((uploadResult) => {
        const dbFile = {
          fileName: uploadResult.Key,
          url: uploadResult.Location,
          bucketName: uploadResult.Bucket,
          service_id: req.body.service_id,
        };
        return db
          .getServiceFilesDB()
          .getGenericQueries()
          .createTableEntryFromPrimitives(dbFile);
      })
    );
    if (dbInsertResultsArray.find((el) => el instanceof Error))
      throw Error("Problem saving to database");
    res.status(201).json("Successfully uploaded files");
  } catch (error) {
    console.log(error);
    res.status(500).json((error as Error).message);
  }
};

export default uploadServiceFileController;
