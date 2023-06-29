import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";
import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";

export class GeneralQueryGenerator {
  //will only work with object<string, string>
  static async createTableEntryFromStrings<T extends IGenericIterableObject>(
    connection: Pool,
    table: string,
    data: T
  ): Promise<ResultSetHeader | Error> {
    const values = Object.values(data);
    const keys = Object.keys(data);

    //create a dynamic query through concatonation of our keys and values
    const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES(${values
      .map(() => "?")
      .join(", ")})`;

    try {
      const [rows] = await connection.execute<ResultSetHeader>(query, values);
      if (!rows) throw new Error("Could Not Create New Entry");
      return rows;
    } catch (error) {
      console.log(error, "Error with creating General Entry From String");
      return error as Error;
    }
  }

  //find entries of a table by either getting all of them or by specifying a column value
  static async findEntryBy<T>(
    connection: Pool,
    table: string,
    column?: string,
    data?: any
  ): Promise<ExtendedRowDataPacket<T>[] | Error> {
    const query = `SELECT * FROM ${table} ${
      column && data && `WHERE ${column} = ?`
    }`;

    try {
      const [result] = await connection.execute<ExtendedRowDataPacket<T>[]>(
        query,
        [data]
      );
      if (!result || result.length === 0)
        throw new Error("Could not find any Entries matching this criteria");

      return result;
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  }
  //works where the column value either a string or a number
  static async deleteById(
    connection: Pool,
    table: string,
    column: string,
    value: string | number
  ): Promise<ResultSetHeader | Error> {
    const query = `DELETE FROM ${table} WHERE ${column} = ?`;

    try {
      const [result] = await connection.execute<ResultSetHeader>(query, [
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
}
