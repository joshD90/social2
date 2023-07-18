import { TCategoryNames } from "../../types/categoryTypes/CategoryTypes";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";

export const categoryThemes = new Map<TCategoryNames, ThemeColor>();

categoryThemes.set("addiction", ThemeColor.orange);
categoryThemes.set("housing", ThemeColor.blue);
categoryThemes.set("material", ThemeColor.cyan);
categoryThemes.set("shelter", ThemeColor.voilet);
categoryThemes.set("medical", ThemeColor.emerald);
categoryThemes.set("mentalHealth", ThemeColor.teal);
