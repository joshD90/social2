import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import queryObj from "./serviceReportQueries";

export class ServiceReportDB {
  private connection: Pool;
  private genericReportQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.genericReportQueries = new GeneralQueryGenerator(
      "serviceReports",
      connection
    );
    this.initDB();
  }

  private async initDB() {
    try {
      await this.connection.query(queryObj.initTable);
    } catch (error) {
      console.log(error);
    }
  }

  public async createEntry(data: {
    userId: number;
    serviceId: number;
    report: string;
  }): Promise<ResultSetHeader | Error> {
    try {
      const newEntry =
        await this.genericReportQueries.createTableEntryFromPrimitives(data);
      if (newEntry instanceof Error) throw Error();
      return newEntry;
    } catch (error) {
      return error as Error;
    }
  }
}
