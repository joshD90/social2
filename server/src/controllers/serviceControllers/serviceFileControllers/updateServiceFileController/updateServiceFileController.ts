import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";

import { deleteFile, uploadFile } from "../../../../utils/AWS/s3/s3_v3";
import { IServiceFile } from "../../../../types/serviceTypes/ServiceType";
import { uploadFileAndSaveDB } from "../uploadFileAndSaveDB/uploadFileAndSaveDB";

const updateServiceFileController = async (req: Request, res: Response) => {
  const { serviceId } = req.body;
  const service_id = parseInt(serviceId);

  const user = req.user as IUser;
  if (!user || user.privileges !== "admin")
    return res
      .status(403)
      .json("Not permitted to update service without admin privileges");

  if (isNaN(service_id)) return res.status(400).json();
  const files = req.files ?? [];

  if (!Array.isArray(files))
    return res.status(400).json("Files not uploaded as an array");

  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();
    const currentDatabase = db.getServiceFilesDB();

    const filesToDelete = await currentDatabase
      .getGenericQueries()
      .findEntryBy<IServiceFile>("service_id", service_id);

    await currentDatabase
      .getGenericQueries()
      .deleteBySingleCriteria("service_id", serviceId, currentConnection);
    console.log("delete files successfully");
    const uploadResult = await uploadFileAndSaveDB(
      files,
      service_id,
      currentDatabase,
      undefined,
      currentConnection
    );
    console.log(uploadResult, "uploadResult in updateServiceFileContoroler");
    await Promise.all(
      filesToDelete.map((fileEntry) => deleteFile(fileEntry.fileName))
    );
    await currentConnection.commit();
    res.status(201).json(uploadResult);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default updateServiceFileController;
