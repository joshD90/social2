import { RowDataPacket } from "mysql2";
import { TCategoryNames } from "../categoryTypes/CategoryType";
import { TIterableStringObj } from "../userTypes/UserType";

export interface ISearchedService extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  category: TCategoryNames;
  organisation: string | null;
  minRequirementsToAccess: string;
  client_groups: string;
  needs_met: string;
  areas_served: string;
  weighting: number;
}

export interface IWeightedSearchedService {
  id: string | number | null;
  name: string;
  weight: number;
  matchingHeaders: TIterableStringObj;
}
