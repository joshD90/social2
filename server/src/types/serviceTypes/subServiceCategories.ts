import { GeneralQueryGenerator } from "../../db/generalQueryGenerator/GeneralQueryGenerator";
import { ExtendedRowDataPacket } from "../mySqlTypes/mySqlTypes";

//set a predefined sub service list of keys
export enum SubServiceKey {
  NeedsMet = "needsMet",
  ClientGroups = "clientGroups",
  AreasServed = "areasServed",
}

export interface ISubServiceItem {
  value: string;
  exclusive: boolean;
}

//this is the type that determines the Tables that will be used depending on what type of sub directory is used
export type SubCategoryTableSpecific = {
  tableQueries: GeneralQueryGenerator;
  junctionTableQueries: GeneralQueryGenerator;
  tableName: string;
  fieldName: string;
};

//when this is returned from the database it will have an id attached to it so we want to type this as well
export type ISubServiceItemReturnSQL = ExtendedRowDataPacket<ISubServiceItem>;

export type TAreasServed = { areasServed: ISubServiceItem[] };
export type TClientGroups = { clientGroups: ISubServiceItem[] };
export type TNeedsMet = { needsMet: ISubServiceItem[] };
