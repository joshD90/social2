import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";
import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";

export class GeneralQueryGenerator {
  private table: string;
  private connection: Pool;

  constructor(table: string, connection: Pool) {
    this.table = table;
    this.connection = connection;
  }

  //will only work with object<string, string>
  public async createTableEntryFromPrimitives(
    data: IGenericIterableObject
  ): Promise<ResultSetHeader | Error> {
    const values = Object.values(data);
    const keys = Object.keys(data);

    //create a dynamic query through concatonation of our keys and values
    const query = `INSERT INTO ${this.table} (${keys.join(
      ", "
    )}) VALUES(${values.map(() => "?").join(", ")})`;

    try {
      const [rows] = await this.connection.execute<ResultSetHeader>(
        query,
        values
      );
      if (!rows) throw new Error("Could Not Create New Entry");
      return rows;
    } catch (error) {
      console.log(error, "Error with creating General Entry From String");
      return error as Error;
    }
  }

  //find entries of a table by either getting all of them or by specifying a column value
  public async findEntryBy<T>(
    column?: string,
    data?: any
  ): Promise<ExtendedRowDataPacket<T>[] | Error> {
    const query = `SELECT * FROM ${this.table} ${
      column && data && `WHERE ${column} = ?`
    }`;

    try {
      const [result] = await this.connection.execute<
        ExtendedRowDataPacket<T>[]
      >(query, [data]);
      if (!result || result.length === 0)
        throw new Error("Could not find any Entries matching this criteria");
      console.log(result);
      return result;
    } catch (error) {
      return error as Error;
    }
  }
  //works where the column value either a string or a number and 1 col Primary Key
  public async deleteBySingleCriteria(
    column: string,
    value: string | number
  ): Promise<ResultSetHeader | Error> {
    const query = `DELETE FROM ${this.table} WHERE ${column} = ?`;

    try {
      const [result] = await this.connection.execute<ResultSetHeader>(query, [
        value,
      ]);

      if (result.affectedRows === 0)
        throw Error("There was no record matching that criteria");

      return result;
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  }

  //for two column primary keys
  //works where the column value either a string or a number and 1 col Primary Key
  public async deleteByTwoCriteria(
    columns: string[],
    values: (string | number)[]
  ): Promise<ResultSetHeader | Error> {
    const query = `DELETE FROM ${this.table} WHERE ${columns[0]} = ? AND ${columns[1]} = ?`;

    try {
      const [result] = await this.connection.execute<ResultSetHeader>(query, [
        values,
      ]);

      if (result.affectedRows === 0)
        throw Error("There was no record matching that criteria");

      return result;
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  }

  //update table by column and values - works when values are strings
  public async updateEntriesByMultiple(
    updateObject: IGenericIterableObject,
    identifierValue: string | number,
    identifierColumn: string
  ): Promise<ResultSetHeader | Error> {
    const keys = Object.keys(updateObject);
    const values = Object.values(updateObject);

    const keysInQuery = keys.map((key) => `${key} = ?`).join(", ");

    const query = `UPDATE ${this.table} SET ${keysInQuery} WHERE ${identifierColumn} = ?`;

    try {
      const [result] = await this.connection.execute<ResultSetHeader>(query, [
        ...values,
        identifierValue,
      ]);
      if (!result || result.affectedRows === 0)
        throw new Error("Could not update this entry");
      return result;
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  }
}
