import { FC, useEffect, useState } from "react";

import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import { ICategory } from "../../types/categoryTypes/CategoryTypes";
import { useNavigate } from "react-router-dom";
import { IService } from "../../types/serviceTypes/Service";

type Props = {
  themeColor: ThemeColor;
  category?: boolean;
  isFullScreen: boolean;
  item: ICategory | IService;
};

const ListItem: FC<Props> = ({ themeColor, category, isFullScreen, item }) => {
  const [dropped, setDropped] = useState(false);
  const navigate = useNavigate();

  //we want the dropped to disappear whenever we change to a larger screen size
  useEffect(() => {
    if (!isFullScreen) setDropped(false);
  }, [isFullScreen]);

  const handleClick = () => {
    if (!category && isFullScreen) {
      return setDropped(!dropped);
    }
    navigate(item.forwardTo);
  };

  return (
    <>
      <div
        className={`w-full flex items-center justify-center text-white cursor-pointer overflow-y-auto ${
          category
            ? twThemeColors.bg[themeColor]
            : twThemeColors.bgGradient[themeColor]
        } ${
          category
            ? "hover:opacity-80"
            : twThemeColors.bgGradientHover[themeColor]
        }`}
        onClick={handleClick}
      >
        <p className="py-5 ">{item.name}</p>
      </div>
      {dropped && <div className="w-full p-10">Dropped Div</div>}
    </>
  );
};

export default ListItem;
