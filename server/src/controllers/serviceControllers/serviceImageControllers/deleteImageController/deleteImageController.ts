import { Request, Response } from "express";
import { deleteImage } from "../../../../utils/AWS/s3/s3";
import { db } from "../../../../server";
const deleteImageController = async (req: Request, res: Response) => {
  const currentConnection = await db.getSinglePoolConnection();

  try {
    await currentConnection.beginTransaction();
    const deleteResult = await deleteImage(req.params.imageKey);

    const deleteFromDB = await db
      .getImagesDB()
      .genericQueries.deleteBySingleCriteria(
        "fileName",
        req.params.imageKey,
        currentConnection
      );

    return res.status(200).json({ deleteResult, deleteFromDB });
  } catch (error) {
    await currentConnection.rollback();
    res.status(500).json((error as Error).message);
  } finally {
    currentConnection.release();
  }
};

export default deleteImageController;
