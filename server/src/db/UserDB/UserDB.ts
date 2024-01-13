import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
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
    userInfo: IUser,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const organisationResult = await this.organisationQueries.findEntryBy<{
      id: number;
      name: string;
    }>("name", userInfo.organisation);
    if (organisationResult.length === 0)
      throw Error("No organisation in the database matched this query");
    userInfo.organisation = organisationResult[0].id;

    const result = await this.userQueries.createTableEntryFromPrimitives(
      userInfo as unknown as IGenericIterableObject,
      currentConnection
    );
    return result;
  }

  public async deleteUser(
    userId: number,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const result = await this.userQueries.deleteBySingleCriteria(
      "id",
      userId,
      currentConnection
    );

    return result;
  }

  public async findUser(
    criteria: UserSearchTuple
  ): Promise<ExtendedRowDataPacket<IUser>[]> {
    if (
      criteria[0] !== "users.id" &&
      criteria[0] !== "email" &&
      criteria[0] !== "organisation"
    )
      throw new Error("Wrong  Crtieria");

    const query = queryObj.generateFindUserQuery(criteria[0]);

    const [result] = await this.connection.query<
      ExtendedRowDataPacket<IUser>[]
    >(query, criteria[1]);
    if (result.length === 0) return [];
    return result;
  }

  public async getAllUsers() {
    const [result] = await this.connection.query<
      ExtendedRowDataPacket<IUser>[]
    >(queryObj.findAllUsers);
    const usersWithoutPasswords = result.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
    return usersWithoutPasswords;
  }

  public async updatePrivileges(
    privilege: string,
    id: number,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    if (
      !(
        privilege === "none" ||
        privilege === "approved" ||
        privilege === "emailConfirmed"
      )
    )
      throw Error(
        "Only none and approved or emailConfirmed privileges can be granted at this endpoint"
      );
    //ensure that only legitimate work flows are taking place for authenticating a user
    const currentUser = await this.userQueries.findEntryBy<IUser>("id", id);
    if (currentUser.length === 0) throw Error("No User found");
    const currentPrivilege = currentUser[0].privileges;

    if (privilege === "approved" && currentPrivilege === "none")
      throw Error(
        "You Cannot promote someone to approved without their email being confirmed"
      );
    if (
      (privilege === "emailConfirmed" && currentPrivilege === "none") ||
      (privilege === "none" && currentPrivilege === "emailConfirmed")
    )
      throw Error("You Cannot confirm email or unconfirm email here");
    //update db

    const [result] = await currentConnection.query<ResultSetHeader>(
      queryObj.updatePrivileges,
      [privilege, id]
    );
    if (result.affectedRows === 0) throw Error("No Affected Rows");
    return result;
  }

  public async getAllOrganisations() {
    const [result] = await this.connection.query<RowDataPacket[]>(
      queryObj.getAllOrganisationsNames
    );

    return result;
  }

  public getGenericUserQueries(): GeneralQueryGenerator {
    return this.userQueries;
  }
}

export default UserDB;
