import { Pool } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";

import dbQueries from "./emailConfirmDBQueries";

import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";
import { IEmailConfirmationKey } from "../../types/userTypes/UserType";

class EmailConfirmationKeysDB {
  public genericEmailConfirmQueries: GeneralQueryGenerator;
  private connection: Pool;

  constructor(pool: Pool) {
    this.connection = pool;
    this.initDB();
    this.genericEmailConfirmQueries = new GeneralQueryGenerator(
      "email_confirmation_keys",
      pool
    );
  }

  private async initDB() {
    await this.connection.execute(dbQueries.initTable);
  }

  public async findEmailKeyPair(email: string, key: string) {
    const [result] = await this.connection.execute<
      ExtendedRowDataPacket<IEmailConfirmationKey>[]
    >(dbQueries.findKeyEmailPair, [email, key]);

    return result;
  }
}

export default EmailConfirmationKeysDB;
