import { Pool, PoolConnection } from "mysql2/promise";

import { queryObj } from "./imageDBQueries";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { generateDownloadUrl } from "../../utils/AWS/s3/s3_v3";

export type UploadedImage = {
  id?: number;
  service_id?: number;
  fileName: string;
  url: string;
  bucket_name: string;
  main_pic?: boolean;
};

export class ImagesDB {
  connection: Pool;
  genericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.initTable();
    this.genericQueries = new GeneralQueryGenerator("images", connection);
  }

  public async addImage(
    image: UploadedImage,
    currentConnection: PoolConnection
  ) {
    const result = await this.genericQueries.createTableEntryFromPrimitives(
      image,
      currentConnection
    );

    return result;
  }

  public async fetchImage(id: number) {
    const result = await this.genericQueries.findEntryBy("id", id);
    const [image] = result;
    return image;
  }

  public async getImageSignedUrlsByService(serviceId: number) {
    const imageEntries = await this.genericQueries.findEntryBy<UploadedImage>(
      "service_id",
      serviceId
    );

    const imgUrls = await Promise.all(
      imageEntries.map(async (img) => ({
        main_pic: img.main_pic,
        url: await generateDownloadUrl(img.fileName),
      }))
    );
    return imgUrls;
  }

  private async initTable() {
    try {
      await this.connection.execute(queryObj.initImageTable);
    } catch (error) {
      console.log(error);
    }
  }
}
