import { PoolConnection } from "mysql2/promise";
import { db } from "../../../../server";
import { uploadFile } from "../../../../utils/AWS/s3/s3_v3";
import ServiceFilesDB from "../../../../db/ServiceFilesDB/ServiceFilesDB";
import { ImagesDB } from "../../../../db/imageDB/ImageDB";

export const uploadFileAndSaveDB = async (
  files: Express.Multer.File[],
  service_id: number,
  database: ServiceFilesDB | ImagesDB,
  mainPicFileName?: string,
  currentConn?: PoolConnection
) => {
  const uploadResultsArray = await Promise.all(
    files.map(async (file) => {
      const currentConnection = currentConn
        ? currentConn
        : await db.getSinglePoolConnection();
      try {
        const uploadResult = await uploadFile(file);

        //don't want to rollback all the previous file upload records if one fails

        const dbFile = {
          fileName: file.originalname,
          url: uploadResult.url,
          bucket_name: uploadResult.bucket_name,
          service_id: service_id,
          ...(mainPicFileName
            ? { main_pic: file.originalname === mainPicFileName }
            : {}),
        };
        const dbEntry = database
          .getGenericQueries()
          .createTableEntryFromPrimitives(dbFile, currentConnection);
        return dbEntry;
      } finally {
        !currentConn && currentConnection.release();
      }
    })
  );
  return uploadResultsArray;
};
