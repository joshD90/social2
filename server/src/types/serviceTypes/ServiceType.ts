import { TCategory } from "../categoryTypes/CategoryType";
import { ExtendedRowDataPacket } from "../mySqlTypes/mySqlTypes";

//this is the base data of the Service, this is our simple data structure that can be fed into the program
export interface IService {
  name: string;
  category: string;
  organisation: string;
  maxAge: number;
  minAge: number;
  contactNumber: string;
  contactEmail: string;
  referralPathway: string;
  address: string;
  imageUrl: string;
  forwardTo: string;
}

//typing for the object that is returned from the mySQL database

export type TServiceReturnSQL = ExtendedRowDataPacket<IService>;
