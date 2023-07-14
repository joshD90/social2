import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ListItem from "../../microcomponents/listItem/ListItem";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { categoryThemes } from "../../assets/themeColors/categoryThemes";
import {
  ICategory,
  TCategoryNames,
} from "../../types/categoryTypes/CategoryTypes";
import { IService } from "../../types/serviceTypes/Service";

type Props = {
  isAboveMedium: boolean;
};
const ListContainer: FC<Props> = ({ isAboveMedium }) => {
  const { category } = useParams();
  const [listItems, setListItems] = useState<IService[] | ICategory[]>([]);

  //fetch Services / categories
  useEffect(() => {
    //make a different request best on url
    const url = category
      ? `http://localhost:3500/service/${category}`
      : "http://localhost:3500/categories";
    const abortController = new AbortController();

    (async () => {
      try {
        const result = await fetch(url, { signal: abortController.signal });
        if (!result.ok) throw Error(result.statusText);
        const data = await result.json();
        setListItems(data);
      } catch (error) {
        console.log(error);
      }
    })();
    //abort the fetch request if component unmounts
    return () => abortController.abort();
  }, [category]);

  return (
    <div className="w-full overflow-y-auto h-full">
      {listItems.map((item, index) => {
        const themeColor = category
          ? categoryThemes.get(item?.category as TCategoryNames)
          : categoryThemes.get(item.forwardTo as TCategoryNames);
        return (
          <ListItem
            themeColor={themeColor ? themeColor : ThemeColor.emerald}
            isFullScreen={!isAboveMedium}
            category={!category}
            item={item}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default ListContainer;
