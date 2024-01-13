import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
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

  public async createEntry(
    data: {
      userId: number;
      serviceId: number;
      report: string;
    },
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const newEntry =
      await this.genericReportQueries.createTableEntryFromPrimitives(
        data,
        currentConnection
      );

    return newEntry;
  }

  public async getEntriesByService(
    serviceId: number | string
  ): Promise<ExtendedRowDataPacket<IServiceReportEntry>[]> {
    const id = typeof serviceId === "number" ? serviceId : parseInt(serviceId);
    if (isNaN(id))
      throw Error("serviceId must be a number or a string of a number");

    const result =
      await this.genericReportQueries.findEntryBy<IServiceReportEntry>(
        "serviceId",
        id
      );

    return result;
  }

  public async getAllServiceReportEntries(): Promise<RowDataPacket[]> {
    const result = await this.genericReportQueries.findEntryBy();
    return result;
  }

  public async getSingleServiceReportEntry(
    id: number
  ): Promise<ExtendedRowDataPacket<IServiceReportEntry>> {
    const result =
      await this.genericReportQueries.findEntryBy<IServiceReportEntry>(
        "id",
        id
      );

    const [firstResult] = result;
    return firstResult;
  }

  public async updateSingleReportStatus(
    reportId: number,
    status: "submitted" | "under review" | "declined" | "accepted",
    currentConnection: PoolConnection
  ): Promise<boolean> {
    if (
      !(
        status === "accepted" ||
        status === "declined" ||
        status === "submitted" ||
        status === "under review"
      )
    )
      throw Error("Status value not in correct range");

    const [result] = await currentConnection.query<ResultSetHeader>(
      queryObj.updateRecordStatus,
      [status, reportId]
    );
    if (result.changedRows === 0)
      throw Error("Unsuccessful update no changes made");
    return true;
  }
}
