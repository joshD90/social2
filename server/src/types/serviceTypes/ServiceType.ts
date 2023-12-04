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
  contactEmail: IServiceEmailContact[];
  referralPathway: string;
  address: string;
  contactNumber: IServicePhoneContact[];
  imageUrl?: string;
  website?: string;
  maxCapacity?: number;
  threshold?: "low" | "high";
  minRequirementsToAccess?: string;
  parent_service_id?: number;
  parent_service_category?: string;
  parent_service_forwardTo: string;
  parent_service_name?: string;
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

export interface IServicePhoneContact {
  id?: number;
  details: string;
  service_id: number;
  phone_number: string;
  public: boolean;
}

export interface IServiceEmailContact {
  id?: number;
  details: string;
  service_id: number;
  email: string;
  public: boolean;
}
