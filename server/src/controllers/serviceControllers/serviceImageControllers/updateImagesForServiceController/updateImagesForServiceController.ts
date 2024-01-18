import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";
import { UploadedImage } from "../../../../db/imageDB/ImageDB";
import { deleteFile, uploadFile } from "../../../../utils/AWS/s3/s3_v3";
import { IServiceFile } from "../../../../types/serviceTypes/ServiceType";
import { uploadFileAndSaveDB } from "../../serviceFileControllers/uploadFileAndSaveDB/uploadFileAndSaveDB";

const updateImagesForServiceController = async (
  req: Request,
  res: Response
) => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res.status(401).json("You are not authorised to make these changes");

  const serviceId = parseInt(req.params.serviceId);
  if (isNaN(serviceId))
    return res.status(400).json("There was an issue with the service id");

  const currentConnection = await db.getSinglePoolConnection();
  await currentConnection.beginTransaction();
  try {
    const currentDatabase = db.getImagesDB();

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      const imagesToDelete = await currentDatabase
        .getGenericQueries()
        .findEntryBy<IServiceFile>("service_id", serviceId);

      await Promise.all(
        imagesToDelete.map((imageEntry) => deleteFile(imageEntry.fileName))
      );

      return res
        .status(200)
        .json("Successfully deleted with no images to upload");
    }

    //index of the main
    const mainPicFileName = req.files[req.body.mainPicIndex]?.originalname;

    const imagesToDelete = await currentDatabase
      .getGenericQueries()
      .findEntryBy<IServiceFile>("service_id", serviceId);

    await currentDatabase
      .getGenericQueries()
      .deleteBySingleCriteria("service_id", serviceId, currentConnection);

    const uploadResult = await uploadFileAndSaveDB(
      req.files,
      serviceId,
      currentDatabase,
      mainPicFileName,
      currentConnection
    );
    //only delete the pictures at the moment right before commiting as we don't want to rollback images back into the db when theyve been deleted from the s3 bucket
    await Promise.all(
      imagesToDelete.map((imageEntry) => deleteFile(imageEntry.fileName))
    );

    await currentConnection.commit();

    return res.status(201).json({ imageDBResults: uploadResult });
  } catch (error) {
    await currentConnection.rollback();
    console.log(error, "error in image updateImagesForService");
    res.status(500).json((error as Error).message);
  } finally {
    currentConnection.release();
  }
};

export default updateImagesForServiceController;
