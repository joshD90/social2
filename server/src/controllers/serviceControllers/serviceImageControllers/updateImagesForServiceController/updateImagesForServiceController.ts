import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";
import { UploadedImage } from "../../../../db/imageDB/ImageDB";
import { deleteImage, uploadFile } from "../../../../utils/s3/s3";

const updateImagesForServiceController = async (
  req: Request,
  res: Response
) => {
  console.log("hit update controller", req.body);
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res.status(401).json("You are not authorised to make these changes");

  const serviceId = parseInt(req.params.serviceId);
  if (isNaN(serviceId))
    return res.status(400).json("There was an issue with the service id");
  console.log(
    "authenticated and serviceId alright in updateService Images controller"
  );
  let keysToDelete = await db
    .getImagesDB()
    .genericQueries.findEntryBy<UploadedImage>("service_id", serviceId);
  console.log(keysToDelete, "keys to delete in updateServiceImagesController");
  if (keysToDelete instanceof Error) {
    if (
      keysToDelete.message !==
      "Could not find any Entries matching this criteria"
    )
      return res.status(500).json(keysToDelete.message);
    keysToDelete = [];
  }
  try {
    const deleteResults = await Promise.all(
      keysToDelete.map((image) => deleteImage(image.fileName))
    );
    console.log(
      deleteResults,
      "deleteResults from AWS in update Services controller"
    );
    if (deleteResults.find((result) => !result))
      return res.status(500).json("One or more images could not be deleted");
    //now that they are all successfully deleted we can upload the new ones
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0)
      return res
        .status(200)
        .json("Successfully deleted with no images to upload");

    const uploadResult = await Promise.all(
      req.files.map((file) => uploadFile(file))
    );
    console.log(
      uploadResult,
      "upload results in updateImagesfor Service Controller"
    );
    //then we need to send the relevant result bits to the database
    const dbInsertResultsArray = await Promise.all(
      uploadResult.map((uploadResult) => {
        const dbImage: UploadedImage = {
          fileName: uploadResult.Key,
          url: uploadResult.Location,
          bucket_name: uploadResult.Bucket,
          service_id: serviceId,
        };
        return db.getImagesDB().addImage(dbImage);
      })
    );
    return res.status(201).json({ imageDBResults: dbInsertResultsArray });
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default updateImagesForServiceController;
