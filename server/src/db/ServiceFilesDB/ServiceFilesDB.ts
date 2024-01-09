import { Pool } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { generateDownloadUrl } from "../../utils/AWS/s3/s3";
import { IServiceFile } from "../../types/serviceTypes/ServiceType";

class ServiceFilesDB {
  private connection: Pool;
  private genericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.genericQueries = new GeneralQueryGenerator(
      "service_files",
      connection
    );
  }

  public async getFilesSignedUrlsByService(serviceId: number) {
    const entries = await this.genericQueries.findEntryBy<IServiceFile>(
      "service_id",
      serviceId
    );
    if (
      entries instanceof Error &&
      entries.message === "Could not find any Entries matching this criteria"
    )
      return [];
    if (entries instanceof Error) throw Error(entries.message);

    const fileUrls = await Promise.all(
      entries.map(async (file) => generateDownloadUrl(file.url))
    );
    return fileUrls;
  }

  public getGenericQueries(): GeneralQueryGenerator {
    return this.genericQueries;
  }
}

export default ServiceFilesDB;
