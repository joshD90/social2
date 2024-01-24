import envConfig from "../../env/envConfig";
import mysql from "mysql2";
import { Pool, PoolConnection } from "mysql2/promise";
import { ServiceDB } from "../ServiceDB/ServiceDB";
import { CategoryDB } from "../CategoryDB/CategoryDB";
import UserDB from "../UserDB/UserDB";
import { ServiceReportDB } from "../ServiceReportDB/ServiceReportDB";
import { DatabaseSearcher } from "../../search/DatabaseSearcher/DatabaseSearcher";
import { CommentsDB } from "../CommentsDB/CommentsDB";
import { ImagesDB } from "../imageDB/ImageDB";
import EmailConfirmationKeysDB from "../emailConfirmationKeysDB/EmailConfirmationKeysDB";
import ServiceFilesDB from "../ServiceFilesDB/ServiceFilesDB";
import { PasswordResetTokenDB } from "../PasswordResetTokenDB/PasswordResetTokenDB";

const { db } = envConfig;
//our overarching database class
class Database {
  private connection: Pool;
  private serviceDB: ServiceDB;
  private categoryDB: CategoryDB;
  private userDB: UserDB;
  private serviceReportDB: ServiceReportDB;
  private databaseSearcher: DatabaseSearcher;
  private commentsDB: CommentsDB;
  private imagesDB: ImagesDB;
  private emailConfirmationKeysDB: EmailConfirmationKeysDB;
  private serviceFilesDB: ServiceFilesDB;
  private passwordResetTokensDB: PasswordResetTokenDB;

  constructor() {
    this.connection = this.initDatabase();
    this.serviceDB = new ServiceDB(this.connection);
    this.serviceDB.initialiseServiceRelatedTables();
    this.categoryDB = new CategoryDB(this.connection);
    this.userDB = new UserDB(this.connection);
    this.serviceReportDB = new ServiceReportDB(this.connection);
    this.databaseSearcher = new DatabaseSearcher(this.connection);
    this.commentsDB = new CommentsDB(this.connection);
    this.imagesDB = new ImagesDB(this.connection);
    this.emailConfirmationKeysDB = new EmailConfirmationKeysDB(this.connection);
    this.serviceFilesDB = new ServiceFilesDB(this.connection);
    this.passwordResetTokensDB = new PasswordResetTokenDB(this.connection);
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
      decimalNumbers: true,
    });

    //setting up pool to accept async await
    const connection = pool.promise();

    return connection;
  }

  public async getSinglePoolConnection(): Promise<PoolConnection> {
    return await this.connection.getConnection();
  }

  //getters
  public getConnection(): Pool {
    return this.connection;
  }
  public getServiceDB(): ServiceDB {
    return this.serviceDB;
  }
  public getCategoryDB(): CategoryDB {
    return this.categoryDB;
  }
  public getUserDB(): UserDB {
    return this.userDB;
  }
  public getServiceReportDB(): ServiceReportDB {
    return this.serviceReportDB;
  }
  public getSearcher(): DatabaseSearcher {
    return this.databaseSearcher;
  }
  public getCommentsDB(): CommentsDB {
    return this.commentsDB;
  }
  public getImagesDB(): ImagesDB {
    return this.imagesDB;
  }
  public getEmailConfirmationKeysDB(): EmailConfirmationKeysDB {
    return this.emailConfirmationKeysDB;
  }
  public getServiceFilesDB(): ServiceFilesDB {
    return this.serviceFilesDB;
  }
  public getPasswordResetTokensDB(): PasswordResetTokenDB {
    return this.passwordResetTokensDB;
  }
}

export default Database;
