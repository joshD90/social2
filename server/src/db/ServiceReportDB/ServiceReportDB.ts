import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import queryObj from "./serviceReportQueries";
import { IServiceReportEntry } from "../../types/serviceTypes/ServiceType";
import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";

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

  public async getEntriesByService(
    serviceId: number | string
  ): Promise<ExtendedRowDataPacket<IServiceReportEntry>[] | Error> {
    const id = typeof serviceId === "number" ? serviceId : parseInt(serviceId);
    if (isNaN(id))
      throw Error("serviceId must be a number or a string of a number");

    try {
      const result =
        await this.genericReportQueries.findEntryBy<IServiceReportEntry>(
          "serviceId",
          id
        );
      if (result instanceof Error) throw new Error(result.message);
      return result;
    } catch (error) {
      return error as Error;
    }
  }

  public async getAllServiceReportEntries(): Promise<RowDataPacket[] | Error> {
    try {
      const result = await this.genericReportQueries.findEntryBy();
      if (result instanceof Error) throw new Error(result.message);
      return result;
    } catch (error) {
      return error as Error;
    }
  }

  public async getSingleServiceReportEntry(
    id: number
  ): Promise<ExtendedRowDataPacket<IServiceReportEntry> | Error> {
    try {
      const result =
        await this.genericReportQueries.findEntryBy<IServiceReportEntry>(
          "id",
          id
        );
      if (result instanceof Error)
        throw Error("There was an error retrieving your data");
      if (result.length === 0)
        throw Error("There were no records matching this id");
      const [firstResult] = result;
      return firstResult;
    } catch (error) {
      return error as Error;
    }
  }
}
