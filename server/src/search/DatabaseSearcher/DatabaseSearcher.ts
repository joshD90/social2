import { Pool } from "mysql2/promise";

export class DatabaseSearcher {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async searchServices(keystring: string) {
    try {
      const result = await this.connection.execute();
    } catch (error) {
      console.log(error);
    }
  }
}
