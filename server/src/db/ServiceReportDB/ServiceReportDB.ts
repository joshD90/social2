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

      return result;
    } catch (error) {
      return error as Error;
    }
  }

  public async getAllServiceReportEntries(): Promise<RowDataPacket[] | Error> {
    try {
      const result = await this.genericReportQueries.findEntryBy();

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

      const [firstResult] = result;
      return firstResult;
    } catch (error) {
      return error as Error;
    }
  }

  public async updateSingleReportStatus(
    reportId: number,
    status: "submitted" | "under review" | "declined" | "accepted"
  ): Promise<boolean | Error> {
    if (
      !(
        status === "accepted" ||
        status === "declined" ||
        status === "submitted" ||
        status === "under review"
      )
    )
      return Error("Status value not in correct range");
    try {
      const [result] = await this.connection.query<ResultSetHeader>(
        queryObj.updateRecordStatus,
        [status, reportId]
      );
      if (result.changedRows === 0)
        throw Error("Unsuccessful update no changes made");
      return true;
    } catch (error) {
      console.log(error, "error in serviceReportStatusChange in db");
      return error as Error;
    }
  }
}
