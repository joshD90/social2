import { Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";

import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { initServiceEmailsTable } from "./serviceEmailsQueries";

import { IServiceEmailContact } from "../../types/serviceTypes/ServiceType";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";

export class ServiceEmailContactsDB {
  private connection: Pool;
  private emailGenericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.initTables();
    this.emailGenericQueries = new GeneralQueryGenerator(
      "service_email_contacts",
      connection
    );
  }

  public async insertMultipleEmails(
    emailContacts: IServiceEmailContact[],
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader[]> {
    const emailResultsArray = emailContacts.map(async (contact) =>
      this.emailGenericQueries.createTableEntryFromPrimitives(
        contact as any,
        currentConnection
      )
    );
    const awaitedResults = await Promise.all(emailResultsArray);

    return awaitedResults as ResultSetHeader[];
  }

  public async fetchEmailContacts(serviceId?: number) {
    let results: IServiceEmailContact[];
    if (!serviceId) {
      results = await this.emailGenericQueries.findEntryBy();
    } else {
      results = await this.emailGenericQueries.findEntryBy(
        "service_id",
        serviceId
      );
    }
    return results;
  }

  public async deleteEmailContacts(
    column: "service_id" | "id",
    value: number,
    currentConnection: PoolConnection
  ) {
    await this.emailGenericQueries.deleteBySingleCriteria(
      column,
      value,
      currentConnection
    );
  }

  public async updateEmailContact(
    emailContact: Partial<IServiceEmailContact>,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    if (typeof emailContact.id !== "string" || emailContact.id !== "number")
      throw Error("Contact id must be present and be of type string or number");
    const updatedEntry = await this.emailGenericQueries.updateEntriesByMultiple(
      emailContact as IGenericIterableObject,
      emailContact.id,
      "id",
      currentConnection
    );
    if (updatedEntry.affectedRows === 0)
      throw new Error("COuld not update Email Contacts");
    return updatedEntry;
  }

  private async initTables() {
    try {
      await this.connection.execute(initServiceEmailsTable);
    } catch (error) {
      console.log(error);
    }
  }
}
