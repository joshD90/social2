import envConfig from "../env/envConfig";
import mysql from "mysql2";
import { Pool } from "mysql2/promise";

const { db } = envConfig;

class Database {
  private connection: Pool;

  constructor() {
    this.connection = this.initDatabase();
  }

  private initDatabase(): Pool {
    //settings for the connection
    const pool = mysql.createPool({
      host: db.host,
      user: db.username,
      database: db.name,
      password: db.password,
      connectionLimit: 10,
      waitForConnections: true,
    });

    //setting up pool to accept async await
    const connection = pool.promise();

    return connection;
  }

  //getters
  getConnection(): Pool {
    return this.connection;
  }
}

export default Database;
