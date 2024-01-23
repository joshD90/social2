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
        //there seems to be an inconsistent problem where sometimes files wont be uploaded, please keep an eye on this
        const uploadResult = await uploadFile(file);
        console.log(uploadResult, "s3 upload result");
        //don't want to rollback all the previous file upload records if one fails
        if (!uploadResult.url) throw Error("No Upload Url / Location");

        const dbFile = {
          fileName: encodeURIComponent(file.originalname),
          url: uploadResult.url,
          bucket_name: uploadResult.bucket_name,
          service_id: service_id,
          ...(mainPicFileName
            ? { main_pic: file.originalname === mainPicFileName }
            : {}),
        };
        console.log(dbFile, "db file in uploadFile and Save DB");

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
