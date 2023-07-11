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
}

//Service with subsections
export interface IServiceWithSubs extends IService {
  needsMet: ISubServiceCategory[];
  areasServed: ISubServiceCategory[];
  clientGroups: ISubServiceCategory[];
}
