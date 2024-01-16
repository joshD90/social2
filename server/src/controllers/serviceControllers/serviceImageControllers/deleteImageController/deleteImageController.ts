import { Request, Response } from "express";
import { deleteFile } from "../../../../utils/AWS/s3/s3_v3";
import { db } from "../../../../server";
const deleteImageController = async (req: Request, res: Response) => {
  const currentConnection = await db.getSinglePoolConnection();

  try {
    const deleteResult = await deleteFile(req.params.imageKey);

    const deleteFromDB = await db
      .getImagesDB()
      .genericQueries.deleteBySingleCriteria(
        "fileName",
        req.params.imageKey,
        currentConnection
      );

    return res.status(200).json({ deleteResult, deleteFromDB });
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default deleteImageController;
