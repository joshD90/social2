import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";

import { uploadFile } from "../../../../utils/AWS/s3/s3_v3";

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

    await db
      .getServiceFilesDB()
      .getGenericQueries()
      .deleteBySingleCriteria("service_id", serviceId, currentConnection);

    Promise.all(
      files.map(async (file) => {
        const uploadResult = await uploadFile(file);
        const dbFile = {
          fileName: file.originalname,
          url: uploadResult.url,
          bucketName: uploadResult.bucket_name,
          service_id: req.body.service_id,
        };
        const createEntryResult = await db
          .getServiceFilesDB()
          .getGenericQueries()
          .createTableEntryFromPrimitives(dbFile, currentConnection);
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default updateServiceFileController;
