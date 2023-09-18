import { ExtendedRowDataPacket } from "../mySqlTypes/mySqlTypes";

export type TCategoryNames =
  | "housing"
  | "mentalHealth"
  | "material"
  | "support groups"
  | "medical"
  | "financial"
  | "shelter"
  | "addiction";

export type TCategory = {
  name: string;
  forwardTo: string;
};

export type TCategoryReturnSQL = ExtendedRowDataPacket<TCategory>;
