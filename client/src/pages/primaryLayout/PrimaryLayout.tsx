import { useMediaQuery } from "../../hooks/useMediaQuery";
import ListContainer from "../../components/listContainer/ListContainer";
import { Outlet } from "react-router-dom";
import "../../assets/themeColors/backgroundGradients.css";
import PrimaryLayoutNav from "./primaryLayoutNav/PrimaryLayoutNav";
import useDisplayOutletChecker from "../../hooks/useDisplayOutletChecker";

const PrimaryLayout = () => {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const shouldOutletBeUsed = useDisplayOutletChecker();
  //for displaying just the ListContainer
  if (!isAboveMedium && !shouldOutletBeUsed)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <PrimaryLayoutNav />
        <ListContainer isAboveMedium={isAboveMedium} />
      </div>
    );

  //on a small screen the layout is solely the list
  if (!isAboveMedium)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <PrimaryLayoutNav />
        <Outlet />
      </div>
    );

  //on larger screens we get the list on the left and the window on the right
  return (
    <div className="w-screen h-screen flex flex-col">
      <PrimaryLayoutNav />
      <div className="flex backgroundAllColorDarkLarge flex-grow max-h-full">
        <div
          className="basis-1/3"
          style={{ maxWidth: "20rem", minWidth: "15rem" }}
        >
          <ListContainer isAboveMedium />
        </div>
        <div className="w-2/3 flex justify-center items-center flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrimaryLayout;
