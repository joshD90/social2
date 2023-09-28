import { TCategory } from "../categoryTypes/CategoryType";
import { ExtendedRowDataPacket } from "../mySqlTypes/mySqlTypes";

//this is the base data of the Service, this is our simple data structure that can be fed into the program
export interface IService {
  name: string;
  forwardTo: string;
  category: string;
  organisation: string;
  description: string;
  maxAge: number;
  minAge: number;
  contactNumber: string;
  contactEmail: string;
  referralPathway: string;
  address: string;
  imageUrl?: string;
  website?: string;
  maxCapacity?: number;
  threshold?: "low" | "high";
  minRequirementsToAccess?: string;
}

//typing for the object that is returned from the mySQL database

export type TServiceReturnSQL = ExtendedRowDataPacket<IService>;

export interface IServiceReport {
  userId: number;
  serviceId: number;
  report: string;
  status?: "submitted" | "under review" | "accepted" | "declined";
}
export interface IServiceReportEntry extends IServiceReport {
  id: number;
  created_at: string;
  updated_at: string | null;
}
