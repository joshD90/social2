import { FC } from "react";
import { ISubServiceCategory } from "../../types/serviceTypes/SubServiceCategories";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";

import { twThemeColors } from "../../assets/themeColors/twThemeColors";

type Props = {
  subServices: ISubServiceCategory[];
  themeColor: ThemeColor;
  title: string;
};

const SubServiceDisplay: FC<Props> = ({ subServices, themeColor, title }) => {
  return (
    <div
      className={`w-full ${twThemeColors.border[themeColor]} border-2 bg-stone-300 mt-5`}
    >
      <h2 className="w-full bg-stone-400 p-2 flex justify-center">{title}</h2>
      <div>
        {subServices.map((item, index) => (
          <div key={index} className="p-2 flex gap-2 items-center">
            <p>{item.value}</p>
            <p className="text-xl">{item.exclusive ? "!" : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubServiceDisplay;
