import { TCategoryNames } from "../categoryTypes/CategoryTypes";
import { TIterableStringObj } from "../userTypes/UserTypes";

export interface IWeightedSearchedService {
  id: string | number | null;
  name: string;
  category: TCategoryNames;
  forwardTo: string;
  weight: number;
  matchingHeaders: TIterableStringObj;
}
