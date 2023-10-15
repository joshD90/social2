import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import queryObj from "./userTableQueries";
import { IUser, UserSearchTuple } from "../../types/userTypes/UserType";
import {
  ExtendedRowDataPacket,
  IGenericIterableObject,
} from "../../types/mySqlTypes/mySqlTypes";

class UserDB {
  private connection: Pool;
  private userQueries: GeneralQueryGenerator;
  private organisationQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.userQueries = new GeneralQueryGenerator("users", connection);
    this.organisationQueries = new GeneralQueryGenerator(
      "organisations",
      connection
    );
    this.initialiseUserTable();
  }

  private async initialiseUserTable() {
    try {
      await this.connection.query(queryObj.initUserTable);
      await this.connection.query(queryObj.initOrganisationTable);
    } catch (error) {
      console.log(error);
    }
  }

  public async createNewUser(
    userInfo: IUser
  ): Promise<ResultSetHeader | Error> {
    try {
      const organisationResult = await this.organisationQueries.findEntryBy<{
        id: number;
        name: string;
      }>("name", userInfo.organisation);
      if (
        organisationResult instanceof Error ||
        organisationResult.length === 0
      )
        throw Error("No organisation in the database matched this query");
      userInfo.organisation = organisationResult[0].id;

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
  //TODO need to change this to work with organisations / search by organisation
  public async findUser(
    criteria: UserSearchTuple
  ): Promise<ExtendedRowDataPacket<IUser>[] | Error> {
    if (
      criteria[0] !== "id" &&
      criteria[0] !== "email" &&
      criteria[0] !== "organisation"
    )
      throw new Error("Wrong  Crtieria");
    const query = queryObj.generateFindUserQuery(criteria[0]);
    try {
      const [result] = await this.connection.query<
        ExtendedRowDataPacket<IUser>[]
      >(query, criteria[1]);
      if (result.length === 0) return [];
      return result;
    } catch (error) {
      return error as Error;
    }
  }
  //TODO: need to error handle
  public async getAllUsers() {
    try {
      const [result] = await this.connection.query(queryObj.findAllUsers);
      return result;
    } catch (error) {
      return error as Error;
    }
  }

  public async updatePrivileges(
    privilege: string,
    id: number
  ): Promise<ResultSetHeader | Error> {
    if (!(privilege === "none" || privilege === "approved"))
      throw Error(
        "Only none and approved privileges can be granted at this endpoint"
      );
    try {
      const [result] = await this.connection.query<ResultSetHeader>(
        queryObj.updatePrivileges,
        [privilege, id]
      );
      if (result.affectedRows === 0) throw Error("No Affected Rows");
      return result;
    } catch (error) {
      return error as Error;
    }
  }
}

export default UserDB;
