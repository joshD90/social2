import { RowDataPacket } from "mysql2";

export interface IGenericIterableObject {
  [key: string]: string | number | boolean;
}

export type mySqlAddedInfo = {
  id: string;
};

export type ExtendedRowDataPacket<T> = RowDataPacket & T & mySqlAddedInfo;
