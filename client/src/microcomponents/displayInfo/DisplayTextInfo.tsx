import { FC } from "react";

import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";

type Props = {
  name: string;
  value: string | number;
  themeColor: ThemeColor;
};

const DisplayTextInfo: FC<Props> = ({ name, value, themeColor }) => {
  return (
    <div
      className={`flex  rounded-sm ${twThemeColors.border[themeColor]} border-2 w-full h-full my-5`}
    >
      <p className="bg-stone-400 p-2 w-36">{name}:</p>
      <p className="p-2 bg-stone-300 flex-grow">{value.toString()}</p>
    </div>
  );
};

export default DisplayTextInfo;
