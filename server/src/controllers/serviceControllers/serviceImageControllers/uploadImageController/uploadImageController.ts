import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { uploadFile } from "../../../../utils/AWS/s3/s3";
import { db } from "../../../../server";
import { UploadedImage } from "../../../../db/imageDB/ImageDB";

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

  try {
    //not very concerned about transactional integrity here, want to focus on parralelisation
    const resultsArray = await Promise.all(
      req.files.map(async (file) => {
        const currentConnection = await db.getSinglePoolConnection();
        await currentConnection.beginTransaction();
        try {
          const fileUploadResult = await uploadFile(file);

          const dbImage: UploadedImage = {
            fileName: fileUploadResult.Key,
            url: fileUploadResult.Location,
            bucket_name: fileUploadResult.Bucket,
            service_id,
            main_pic: fileUploadResult.Key === mainPicFileName,
          };

          db.getImagesDB().addImage(dbImage, currentConnection);
          await currentConnection.commit();
        } finally {
          currentConnection.release();
        }
      })
    );
    console.log(resultsArray, "RESULTS ARRAY IN UPLOAD IMAGE CONTROLLER");
    res.status(201).json({ imageDBEntries: resultsArray });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
