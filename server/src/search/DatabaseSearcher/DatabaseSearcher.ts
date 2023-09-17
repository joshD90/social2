import { Pool } from "mysql2/promise";
import queryObj from "./databaseSearcherQueries";

export class DatabaseSearcher {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async searchServices(keyString: string) {
    try {
      const result = await this.connection.execute(
        queryObj.searchServicesQuery,
        replicateKeyString(keyString)
      );
      console.log(result[0], "result");
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
}

const replicateKeyString = (searchParam: string) => {
  const replicateArray = [];
  for (let i = 0; i < 7; i++) {
    replicateArray.push(`'%${searchParam}%'`);
  }
  console.log(replicateArray);
  return replicateArray;
};
