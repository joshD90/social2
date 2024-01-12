import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";
import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";
import { PoolConnection } from "mysql2/promise";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export class GeneralQueryGenerator {
  private table: string;
  private connection: Pool;

  constructor(table: string, connection: Pool) {
    this.table = table;
    this.connection = connection;
  }

  //will only work with object<string, string>
  public async createTableEntryFromPrimitives(
    data: IGenericIterableObject,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const values = Object.values(data);
    const keys = Object.keys(data);

    //create a dynamic query through concatonation of our keys and values
    const query = `INSERT INTO ${this.table} (${keys.join(
      ", "
    )}) VALUES(${values.map(() => "?").join(", ")})`;

    const [rows] = await currentConnection.execute<ResultSetHeader>(
      query,
      values
    );
    if (!rows) throw new Error("Could Not Create New Entry");
    return rows;
  }

  //find entries of a table by either getting all of them or by specifying a column value
  public async findEntryBy<T>(
    column?: string,
    data?: any
  ): Promise<ExtendedRowDataPacket<T>[]> {
    const additionalSearchInfo = column && data ? `WHERE ${column} = ?` : "";
    const query = `SELECT * FROM ${this.table} ${additionalSearchInfo}`;

    const [result] = await this.connection.execute<ExtendedRowDataPacket<T>[]>(
      query,
      data ? [data] : null
    );
    return result;
  }
  //works where the column value either a string or a number and 1 col Primary Key
  public async deleteBySingleCriteria(
    column: string,
    value: string | number,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const query = `DELETE FROM ${this.table} WHERE ${column} = ?`;

    const dataBack = await currentConnection.execute<ResultSetHeader>(query, [
      value,
    ]);
    const [result] = dataBack;

    return result;
  }

  //for two column primary keys
  //works where the column value either a string or a number and 1 col Primary Key
  public async deleteByTwoCriteria(
    columns: string[],
    values: (string | number)[],
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const query = `DELETE FROM ${this.table} WHERE ${columns[0]} = ? AND ${columns[1]} = ?`;

    const [result] = await currentConnection.execute<ResultSetHeader>(query, [
      values,
    ]);

    return result;
  }

  //update table by column and values - works when values are strings
  public async updateEntriesByMultiple(
    updateObject: IGenericIterableObject,
    identifierValue: string | number,
    identifierColumn: string,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const keys = Object.keys(updateObject);
    const values = Object.values(updateObject);

    const columnWhiteList = await this.getTableColumnNames(this.table);

    //sanitize data

    keys.forEach((column) => {
      if (!columnWhiteList.includes(column)) {
        throw new Error("Column name does not match approved list");
      }
    });

    const keysInQuery = keys.map((key) => `${key} = ?`).join(", ");
    //identifier column for where fieldName = "someValue" <-identifier value so we dont update the whole table
    const query = `UPDATE ${this.table} SET ${keysInQuery} WHERE ${identifierColumn} = ?`;

    const dataBack = await currentConnection.execute<ResultSetHeader>(query, [
      ...values,
      identifierValue,
    ]);
    const [result] = dataBack;

    return result;
  }

  public getTableName(): string {
    return this.table;
  }

  public async getTableColumnNames(tableName: string): Promise<any> {
    const query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?`;
    try {
      const result = await this.connection.execute<RowDataPacket[]>(query, [
        tableName,
      ]);
      const [onlyColumns] = result;
      const columnNameArray = onlyColumns.map((row) => row.COLUMN_NAME);

      return columnNameArray;
    } catch (error) {
      return Error((error as Error).message);
    }
  }
}
