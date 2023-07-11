import React, { useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ListContainer from "../../components/listContainer/ListContainer";

const PrimaryLayout = () => {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  useEffect(() => {
    console.log(!isAboveMedium, "isFullScreen");
  }, [isAboveMedium]);
  //on a small screen the layout is solely the list
  if (!isAboveMedium)
    return (
      <div className="w-screen h-screen bg-stone-500">
        <ListContainer isAboveMedium={isAboveMedium} />
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
        Where a Service Might Go Or Some Info on the Category maybe explaining
      </div>
    </div>
  );
};

export default PrimaryLayout;
