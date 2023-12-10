import { Pool } from "mysql2/promise";

import { queryObj } from "./imageDBQueries";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";

export type UploadedImage = {
  id?: number;
  service_id?: number;
  fileName: string;
  url: string;
};

export class ImagesDB {
  connection: Pool;
  genericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.initTable();
    this.genericQueries = new GeneralQueryGenerator("images", connection);
  }

  public async addImage(image: UploadedImage) {
    const result = await this.genericQueries.createTableEntryFromPrimitives(
      image
    );
    if (result instanceof Error) throw Error(result.message);
    return result;
  }

  public async fetchImage(id: number) {
    const result = await this.genericQueries.findEntryBy("id", id);
    if (result instanceof Error) throw Error(result.message);
    const [image] = result;
    return image;
  }

  private async initTable() {
    try {
      await this.connection.execute(queryObj.initImageTable);
    } catch (error) {
      console.log(error);
    }
  }
}
