import envConfig from "../env/envConfig";
import mysql from "mysql2";
import { Pool } from "mysql2/promise";
import { ServiceDB } from "./ServiceDB/ServiceDB";

const { db } = envConfig;
//our overarching database class
class Database {
  private connection: Pool;
  private serviceDB: ServiceDB;

  constructor() {
    this.connection = this.initDatabase();
    this.serviceDB = new ServiceDB(this.connection);
    this.serviceDB.initialiseServiceRelatedTables();
  }
  //connection initialises within the constructor of the database
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
  getServiceDB(): ServiceDB {
    return this.serviceDB;
  }
}

export default Database;
