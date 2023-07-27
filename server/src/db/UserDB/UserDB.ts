import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import queryObj from "./userTableQueries";
import { IUser, UserSearchTuple } from "../../types/userTypes/UserType";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";

class UserDB {
  private connection: Pool;
  private userQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.userQueries = new GeneralQueryGenerator("users", connection);
    this.initialiseUserTable();
  }

  private async initialiseUserTable() {
    try {
      await this.connection.query(queryObj.initUserTable);
      console.log("user table initialised");
    } catch (error) {
      console.log(error);
    }
  }

  public async createNewUser(
    userInfo: IUser
  ): Promise<ResultSetHeader | Error> {
    try {
      const result = await this.userQueries.createTableEntryFromPrimitives(
        userInfo as unknown as IGenericIterableObject
      );
      if (result instanceof Error) throw new Error(result.message);
      return result;
    } catch (error) {
      return Error((error as Error).message);
    }
  }

  public async deleteUser(userId: number): Promise<ResultSetHeader | Error> {
    try {
      const result = await this.userQueries.deleteBySingleCriteria(
        "id",
        userId
      );
      if (result instanceof Error) throw new Error(result.message);
      return result;
    } catch (error) {
      return Error((error as Error).message);
    }
  }

  public async findUser(
    criteria: UserSearchTuple
  ): Promise<RowDataPacket[] | Error> {
    try {
      const result = await this.userQueries.findEntryBy<IUser>(
        criteria[0],
        criteria[1]
      );
      if (result instanceof Error) {
        if (
          result.message === "Could not find any Entries matching this criteria"
        ) {
          return [];
        } else {
          throw Error(result.message);
        }
      }
      return result;
    } catch (error) {
      return error as Error;
    }
  }
}

export default UserDB;
