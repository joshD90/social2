import { IListItemBase, TCategoryNames } from "../categoryTypes/CategoryTypes";
import { ISubServiceCategory } from "./SubServiceCategories";

export interface TIterableService {
  [key: string]: string | number | ISubServiceCategory[];
}

//our basic structure
export interface IService extends IListItemBase {
  category: TCategoryNames;
  organisation: string;
  maxAge: number;
  minAge: number;
  contactNumber: string;
  contactEmail: string;
  referralPathway: string;
  address: string;
  imageUrl: string;
  description: string;
  website?: string;
  maxCapacity?: number;
  threshold?: "high" | "low";
  minRequirementsToAccess?: string;
  parent_service_id?: number;
  parent_service_category?: string;
  parent_service_forwardTo: string;
  parent_service_name?: string;
}

//Service with subsections
export interface IServiceWithSubs extends IService {
  needsMet: ISubServiceCategory[];
  areasServed: ISubServiceCategory[];
  clientGroups: ISubServiceCategory[];
}

export interface IServiceWithChildren extends IServiceWithSubs {
  children?: ChildService[];
}

export type ChildService = {
  id: number;
  name: string;
  forwardTo: string;
  category: string;
};
