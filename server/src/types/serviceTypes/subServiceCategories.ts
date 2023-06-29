import { ExtendedRowDataPacket } from "../mySqlTypes/mySqlTypes";

//set a predefined sub service list of keys
enum SubServiceKey {
  NeedsMet = "needsMet",
  ClientGroups = "clientGroups",
  AreasServed = "areasServed",
}

interface ISubServiceItem {
  value: string;
  exclusive: boolean;
}
//when this is returned from the database it will have an id attached to it so we want to type this as well
export type ISubServiceItemReturnSQL = ExtendedRowDataPacket<ISubServiceItem>;

export type TAreasServed = { areasServed: ISubServiceItem[] };
export type TClientGroups = { clientGroups: ISubServiceItem[] };
export type TNeedsMet = { needsMet: ISubServiceItem[] };
