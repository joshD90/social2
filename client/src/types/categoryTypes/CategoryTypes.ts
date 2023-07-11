import { ThemeColor } from "../themeColorTypes/themeColorTypes";

export type TCategoryNames =
  | "housing"
  | "mentalHealth"
  | "material"
  | "support groups"
  | "medical"
  | "financial"
  | "shelter"
  | "addiction";

export interface IListItemBase {
  id?: number | string;
  name: string;
  forwardTo: string;
  category?: TCategoryNames;
}

export interface ICategory extends IListItemBase {
  name: TCategoryNames;
}
