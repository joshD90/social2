import { Pool, ResultSetHeader } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";

import queryObj from "./serviceContactsQueries";
import { IServicePhoneContact } from "../../types/serviceTypes/ServiceType";

import {
  ExtendedRowDataPacket,
  IGenericIterableObject,
} from "../../types/mySqlTypes/mySqlTypes";

class ServiceContactsDB {
  private connection: Pool;
  private phoneGenericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.initTables();
    this.phoneGenericQueries = new GeneralQueryGenerator(
      "service_phone_numbers",
      connection
    );
  }

  public async insertPhoneContacts(
    contacts: IServicePhoneContact[]
  ): Promise<ResultSetHeader[]> {
    const allResults = Promise.all(
      contacts.map(async (contact) => {
        return this.phoneGenericQueries.createTableEntryFromPrimitives(
          contact as any
        );
      })
    );
    const allResultsAwaited = await allResults;

    if (allResultsAwaited.find((result) => result instanceof Error))
      throw new Error("Something went wrong with inserting contacts");
    return allResultsAwaited as ResultSetHeader[];
  }

  public async fetchPhoneContacts(serviceId?: number) {
    let results: Error | ExtendedRowDataPacket<IServicePhoneContact>[];
    if (!serviceId) {
      results = await this.phoneGenericQueries.findEntryBy();
    } else {
      results = await this.phoneGenericQueries.findEntryBy(
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
  //can either delete a single contact number or delete them all based on the service theyre attached to
  public async deletePhoneContactsByService(
    column: "service_id" | "id",
    value: number
  ) {
    await this.phoneGenericQueries.deleteBySingleCriteria(column, value);
  }

  public async updatePhoneContacts(contact: Partial<IServicePhoneContact>) {
    if (!contact.id) throw Error("Needs an id");
    const updatedEntry = await this.phoneGenericQueries.updateEntriesByMultiple(
      contact as any as IGenericIterableObject,
      contact.id,
      "id"
    );
    if (updatedEntry instanceof Error) throw Error(updatedEntry.message);
    return updatedEntry;
  }

  public async initTables() {
    await this.connection.execute(queryObj.initServicePhones);
  }
}

export default ServiceContactsDB;
