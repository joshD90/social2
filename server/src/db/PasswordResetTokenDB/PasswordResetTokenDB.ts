import { Pool, RowDataPacket } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";

import queryObj from "./passwordResetTokenQueries";

export class PasswordResetTokenDB {
  private connection: Pool;
  private genericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.initTable();
    this.genericQueries = new GeneralQueryGenerator(
      "password_reset_tokens",
      connection
    );
  }

  private async initTable() {
    await this.connection.execute(queryObj.initTableQuery);
  }

  public async findUserTokenPair(username: string, token: string) {
    const [tokenResult] = await this.connection.execute<RowDataPacket[]>(
      queryObj.findUserAndToken,
      [username, token]
    );
    return tokenResult;
  }

  public getGenericQueries(): GeneralQueryGenerator {
    return this.genericQueries;
  }
}
