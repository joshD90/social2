import { Pool, PoolConnection } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { generateDownloadUrl } from "../../utils/AWS/s3/s3";
import { IServiceFile } from "../../types/serviceTypes/ServiceType";

import dbQueries from "./ServiceFilesDBQueries";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";

class ServiceFilesDB {
  private connection: Pool;
  private genericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.genericQueries = new GeneralQueryGenerator(
      "service_files",
      connection
    );
    this.initTable();
  }

  public async getFilesSignedUrlsByService(serviceId: number) {
    const entries = await this.genericQueries.findEntryBy<IServiceFile>(
      "service_id",
      serviceId
    );

    const fileUrls = await Promise.all(
      entries.map(async (file) => generateDownloadUrl(file.url))
    );
    return fileUrls;
  }

  private async initTable() {
    await this.connection.execute(dbQueries.initTable);
  }

  public getGenericQueries(): GeneralQueryGenerator {
    return this.genericQueries;
  }
}

export default ServiceFilesDB;
