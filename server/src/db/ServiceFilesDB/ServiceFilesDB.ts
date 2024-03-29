import { Pool } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { generateDownloadUrl } from "../../utils/AWS/s3/s3_v3";
import { IServiceFile } from "../../types/serviceTypes/ServiceType";

import dbQueries from "./ServiceFilesDBQueries";

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
    const entries = await this.getGenericQueries().findEntryBy<IServiceFile>(
      "service_id",
      serviceId
    );

    const fileUrls = await Promise.all(
      entries.map(async (file) => generateDownloadUrl(file.url))
    );
    return fileUrls;
  }

  public async getFileSignedUrlByColumn(
    columnName: string,
    columnValue: string | number
  ) {
    const entry = await this.getGenericQueries().findEntryBy<IServiceFile>(
      columnName,
      columnValue
    );
    if (!entry[0]) return undefined;
    const signedUrl = await generateDownloadUrl(entry[0].fileName);

    return signedUrl;
  }

  private async initTable() {
    await this.connection.execute(dbQueries.initTable);
  }

  public getGenericQueries(): GeneralQueryGenerator {
    return this.genericQueries;
  }
}

export default ServiceFilesDB;
