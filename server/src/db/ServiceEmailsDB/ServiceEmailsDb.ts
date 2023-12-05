import { Pool, ResultSetHeader } from "mysql2/promise";

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
    emailContacts: IServiceEmailContact[]
  ): Promise<ResultSetHeader[]> {
    const emailResultsArray = emailContacts.map(async (contact) =>
      this.emailGenericQueries.createTableEntryFromPrimitives(contact as any)
    );
    const awaitedResults = await Promise.all(emailResultsArray);

    if (awaitedResults.find((result) => result instanceof Error))
      throw new Error("There was an Error in creating your email contacts");
    return awaitedResults as ResultSetHeader[];
  }

  public async fetchEmailContacts(serviceId?: number) {
    let results: Error | IServiceEmailContact[];
    if (!serviceId) {
      results = await this.emailGenericQueries.findEntryBy();
    } else {
      results = await this.emailGenericQueries.findEntryBy(
        "service_id",
        serviceId
      );
    }

    if (
      results instanceof Error &&
      results.message === "Could not find any Entries matching this criteria"
    )
      return [];
    if (results instanceof Error) throw new Error(results.message);
    return results;
  }

  public async deleteEmailContacts(column: "service_id" | "id", value: number) {
    const deleteResult = await this.emailGenericQueries.deleteBySingleCriteria(
      column,
      value
    );
    if (deleteResult instanceof Error) throw deleteResult.message;
  }

  public async updateEmailContact(
    emailContact: Partial<IServiceEmailContact>
  ): Promise<ResultSetHeader> {
    if (typeof emailContact.id !== "string" || emailContact.id !== "number")
      throw Error("Contact id must be present and be of type string or number");
    const updatedEntry = await this.emailGenericQueries.updateEntriesByMultiple(
      emailContact as IGenericIterableObject,
      emailContact.id,
      "id"
    );
    if (updatedEntry instanceof Error) throw new Error(updatedEntry.message);
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
