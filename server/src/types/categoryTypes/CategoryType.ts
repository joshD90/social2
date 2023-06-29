import { ExtendedRowDataPacket } from "../mySqlTypes/mySqlTypes";

export type TCategory = {
  name: string;
  forwardTo: string;
};

export type TCategoryReturnSQL = ExtendedRowDataPacket<TCategory>;
