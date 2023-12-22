import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { uploadFile } from "../../../../utils/s3/s3";
import { db } from "../../../../server";
import { UploadedImage } from "../../../../db/imageDB/ImageDB";
import { ManagedUpload } from "aws-sdk/clients/s3";

export const uploadImageController = async (req: Request, res: Response) => {
  console.log("hit upload controller", req.body);
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

  const service_id = req.body.service_id ?? null;
  const mainPicFileName = req.body.mainPicFileName ?? null;

  try {
    //we need to do the uploading here
    const resultsArray = await Promise.all(
      req.files.map(async (file) => ({
        ...(await uploadFile(file)),
        main_pic: file.originalname === mainPicFileName,
      }))
    );

    //then we need to send the relevant result bits to the database
    const dbInsertResultsArray = await Promise.all(
      resultsArray.map((uploadResult) => {
        const dbImage: UploadedImage = {
          fileName: uploadResult.Key,
          url: uploadResult.Location,
          bucket_name: uploadResult.Bucket,
          service_id,
          main_pic: uploadResult.main_pic,
        };

        return db.getImagesDB().addImage(dbImage);
      })
    );

    res.status(201).json({ imageDBEntries: dbInsertResultsArray });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
