import { Pool } from "mysql2/promise";
import { initServiceTablesQueries as initQueryObj } from "./serviceInitDBQueries";

export class ServiceDB {
  private connection: Pool;
  constructor(connection: Pool) {
    this.connection = connection;
  }
  //create all our tables if they don't exist already
  public async initialiseServiceRelatedTables(): Promise<void> {
    try {
      //main tables
      await this.connection.query(initQueryObj.createCategoriesTable);
      await this.connection.query(initQueryObj.createServicesTable);
      //sub tables
      await this.connection.query(initQueryObj.createNeedsMetTable);
      await this.connection.query(initQueryObj.createClientGroupTable);
      await this.connection.query(initQueryObj.createAreaServedTable);
      //junction tables
      await this.connection.query(
        initQueryObj.createServiceClientGroupJunction
      );
      await this.connection.query(initQueryObj.createServiceAreaJunction);
      await this.connection.query(initQueryObj.createServiceNeedsJunction);
    } catch (error) {
      console.log(error);
    }
  }

  //create service methods
}
