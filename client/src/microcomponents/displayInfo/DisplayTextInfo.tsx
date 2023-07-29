import { FC, useContext } from "react";

import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import { AuthContext } from "../../context/authContext/AuthContext";

type Props = {
  name: string;
  value: string | number;
  themeColor: ThemeColor;
};

const DisplayTextInfo: FC<Props> = ({ name, value, themeColor }) => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser, "current User in display text info");
  return (
    <div
      className={`flex  rounded-sm ${twThemeColors.border[themeColor]} border-2 w-full my-2`}
    >
      <p className="bg-stone-400 p-2 w-36">{name}:</p>
      <p className="p-2 bg-stone-300 flex-grow">{value?.toString()}</p>
    </div>
  );
};

export default DisplayTextInfo;
