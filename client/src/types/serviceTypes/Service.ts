import { IListItemBase, TCategoryNames } from "../categoryTypes/CategoryTypes";
import { ISubServiceCategory } from "./SubServiceCategories";

export interface TIterableService {
  [key: string]:
    | string
    | number
    | string[]
    | ISubServiceCategory[]
    | IServicePhoneContact[]
    | IServiceEmailContact[];
}

//our basic structure
export interface IService extends IListItemBase {
  category: TCategoryNames;
  organisation: string;
  maxAge: number;
  minAge: number;
  contactNumber: IServicePhoneContact[] | string;
  contactEmail: IServiceEmailContact[] | string;
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
  parent_service_forwardTo?: string;
  parent_service_name?: string;
  imageUrls?: { main_pic: boolean | undefined; url: string }[];
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

export interface IServicePhoneContact {
  id?: number;
  details: string;
  service_id?: number;
  phone_number: string;
  public: boolean;
}

export interface IServiceEmailContact {
  id?: number;
  details: string;
  service_id?: number;
  email: string;
  public: boolean;
}

export interface IFileWithPrimary extends File {
  main_pic?: boolean;
}
