import { Pool } from "mysql2/promise";
import queryObj from "./databaseSearcherQueries";

export class DatabaseSearcher {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async searchServices(keyString: string) {
    try {
      const result = await this.connection.execute(queryObj.joinServiceTables);
    } catch (error) {
      console.log(error);
    }
  }
}
