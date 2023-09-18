import { useLocation, useParams } from "react-router-dom";
import findQueryParam from "../../utils/queryParams/findQueryParam";
import { useContext, useMemo, useState } from "react";
import { BsChevronCompactDown } from "react-icons/bs";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { categoryThemes } from "../../assets/themeColors/categoryThemes";
import ServiceDisplay from "../serviceDisplay/ServiceDisplay";

import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { TCategoryNames } from "../../types/categoryTypes/CategoryTypes";
import { AuthContext } from "../../context/authContext/AuthContext";
import AdminServiceReportsMultiple from "../../components/admin/adminServiceReports/adminServiceReportsMultiple/AdminServiceReportsMultiple";

const ServiceDisplayContainer = () => {
  const myCurrentUrl = useLocation();
  const { category } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [themeColor] = useState(categoryThemes.get(category as TCategoryNames));
  const [reportsOpen, setReportsOpen] = useState(false);

  const serviceId = findQueryParam(myCurrentUrl.search, "id");

  const isAboveMedium = useMediaQuery("(min-width:768px)");

  const generatePathForBackClick = useMemo(
    () =>
      ((): string => {
        //if we are in the admin section stay in admin section
        if (myCurrentUrl.pathname.split("/").includes("admin"))
          return "/admin/services";
        if (isAboveMedium && category) return "/services";
        return `/services/${category}`;
      })(),
    [myCurrentUrl, isAboveMedium, category]
  );

  return (
    <section
      className="overflow-auto"
      //factor in the navbar height
      style={{ height: "calc(100vh - 2.5rem)" }}
    >
      <ServiceDisplay
        backClickPath={generatePathForBackClick}
        serviceId={serviceId}
        themeColor={themeColor ? themeColor : ThemeColor.blue}
      />
      {currentUser?.user?.privileges === "admin" && (
        <div
          className={`w-full bg-yellow-500 ${
            reportsOpen ? "max-h-96 overflow-auto" : "h-10 overflow-hidden"
          }`}
        >
          <div className="flex items-center h-10 w-full justify-between px-3">
            <h1 className="justify-self-center">Issue Reports</h1>
            <button
              className="text-4xl font-extrabold"
              onClick={() => setReportsOpen((prev) => !prev)}
            >
              <BsChevronCompactDown />
            </button>
          </div>
          <AdminServiceReportsMultiple serviceId={serviceId} />
        </div>
      )}
    </section>
  );
};

export default ServiceDisplayContainer;
