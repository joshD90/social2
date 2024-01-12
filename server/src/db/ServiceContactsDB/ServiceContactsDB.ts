import { Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
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
    contacts: IServicePhoneContact[],
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader[]> {
    const allResults = Promise.all(
      contacts.map(async (contact) => {
        return this.phoneGenericQueries.createTableEntryFromPrimitives(
          contact as any,
          currentConnection
        );
      })
    );
    const allResultsAwaited = await allResults;

    return allResultsAwaited as ResultSetHeader[];
  }

  public async fetchPhoneContacts(serviceId?: number) {
    let results: ExtendedRowDataPacket<IServicePhoneContact>[];
    if (!serviceId) {
      results = await this.phoneGenericQueries.findEntryBy();
    } else {
      results = await this.phoneGenericQueries.findEntryBy(
        "service_id",
        serviceId
      );
    }
    return results;
  }
  //can either delete a single contact number or delete them all based on the service theyre attached to
  public async deletePhoneContactsByService(
    column: "service_id" | "id",
    value: number,
    currentConnection: PoolConnection
  ) {
    await this.phoneGenericQueries.deleteBySingleCriteria(
      column,
      value,
      currentConnection
    );
  }

  public async updatePhoneContacts(
    contact: Partial<IServicePhoneContact>,
    currentConnection: PoolConnection
  ) {
    if (!contact.id) throw Error("Needs an id");
    const updatedEntry = await this.phoneGenericQueries.updateEntriesByMultiple(
      contact as any as IGenericIterableObject,
      contact.id,
      "id",
      currentConnection
    );
    if (updatedEntry.affectedRows === 0)
      throw Error("Could not update phone contact");
    return updatedEntry;
  }

  public async initTables() {
    await this.connection.execute(queryObj.initServicePhones);
  }
}

export default ServiceContactsDB;
