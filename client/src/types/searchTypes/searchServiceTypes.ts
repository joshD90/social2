import { TIterableStringObj } from "../userTypes/UserTypes";

export interface IWeightedSearchedService {
  id: string | number | null;
  name: string;
  weight: number;
  matchingHeaders: TIterableStringObj;
}
