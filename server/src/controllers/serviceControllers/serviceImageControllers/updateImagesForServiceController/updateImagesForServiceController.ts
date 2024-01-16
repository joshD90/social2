import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";
import { UploadedImage } from "../../../../db/imageDB/ImageDB";
import { deleteFile, uploadFile } from "../../../../utils/AWS/s3/s3_v3";

const updateImagesForServiceController = async (
  req: Request,
  res: Response
) => {
  console.log("Hitting the Update Images for Service Endpoint");
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res.status(401).json("You are not authorised to make these changes");

  const serviceId = parseInt(req.params.serviceId);
  if (isNaN(serviceId))
    return res.status(400).json("There was an issue with the service id");

  const currentConnection = await db.getSinglePoolConnection();
  await currentConnection.beginTransaction();
  try {
    let keysToDelete = await db
      .getImagesDB()
      .genericQueries.findEntryBy<UploadedImage>("service_id", serviceId);

    const deleteResults = await Promise.all(
      keysToDelete.map((image) => deleteFile(image.fileName))
    );

    if (deleteResults.find((result) => !result))
      return res.status(500).json("One or more images could not be deleted");
    //now that they are all successfully deleted we can upload the new ones
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0)
      return res
        .status(200)
        .json("Successfully deleted with no images to upload");

    //index of the main
    const mainPicFileName = req.files[req.body.mainPicIndex]?.originalname;

    await db
      .getImagesDB()
      .genericQueries.deleteBySingleCriteria(
        "service_id",
        serviceId,
        currentConnection
      );

    const uploadResult = await Promise.all(
      req.files.map(async (file) => {
        const uploadedFile = await uploadFile(file);

        const dbImage: UploadedImage = {
          fileName: file.originalname,
          url: uploadedFile.url,
          bucket_name: uploadedFile.bucket_name,
          service_id: serviceId,
          main_pic: file.originalname === mainPicFileName,
        };
        return db.getImagesDB().addImage(dbImage, currentConnection);
      })
    );

    await currentConnection.commit();

    return res.status(201).json({ imageDBResults: uploadResult });
  } catch (error) {
    await currentConnection.rollback();
    res.status(500).json((error as Error).message);
  } finally {
    currentConnection.release();
  }
};

export default updateImagesForServiceController;
