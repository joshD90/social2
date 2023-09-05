import { useMediaQuery } from "../../hooks/useMediaQuery";
import ListContainer from "../../components/listContainer/ListContainer";

import { useParams } from "react-router-dom";
import ServiceDisplay from "../serviceDisplay/ServiceDisplay";
import CategoryLanding from "../categoryLanding/CategoryLanding";

import "../../assets/themeColors/backgroundGradients.css";
import PrimaryLayoutNav from "./primaryLayoutNav/PrimaryLayoutNav";

const PrimaryLayout = () => {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { serviceId } = useParams();

  //on a small screen the layout is solely the list
  if (!isAboveMedium && !serviceId)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <PrimaryLayoutNav />
        <ListContainer isAboveMedium={isAboveMedium} />
      </div>
    );
  //and the service will take up the whole screen on smaller devices
  if (!isAboveMedium && serviceId)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <PrimaryLayoutNav />
        <ServiceDisplay />
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
        <div className="w-full flex justify-center items-center">
          {serviceId ? <ServiceDisplay /> : <CategoryLanding />}
        </div>
      </div>
    </div>
  );
};

export default PrimaryLayout;
