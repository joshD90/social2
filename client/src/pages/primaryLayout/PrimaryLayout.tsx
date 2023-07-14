import React, { useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ListContainer from "../../components/listContainer/ListContainer";
import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { useParams } from "react-router-dom";
import ServiceDisplay from "../serviceDisplay/ServiceDisplay";

const PrimaryLayout = () => {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { category, serviceId } = useParams();

  //on a small screen the layout is solely the list
  if (!isAboveMedium && !serviceId)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <ListContainer isAboveMedium={isAboveMedium} />
      </div>
    );
  //and the service will take up the whole screen on smaller devices
  if (!isAboveMedium && serviceId)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <ServiceDisplay />
      </div>
    );

  //on larger screens we get the list on the left and the window on the right
  return (
    <div className="w-screen h-screen flex bg-stone-500">
      <div
        className="basis-1/3"
        style={{ maxWidth: "20rem", minWidth: "15rem" }}
      >
        <ListContainer isAboveMedium />
      </div>
      <div className="w-full flex justify-center items-center">
        <ServiceDisplay />
      </div>
    </div>
  );
};

export default PrimaryLayout;
