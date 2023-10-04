import { useLocation, useParams } from "react-router-dom";
import findQueryParam from "../../utils/queryParams/findQueryParam";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BsChevronCompactDown } from "react-icons/bs";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { categoryThemes } from "../../assets/themeColors/categoryThemes";
import ServiceDisplay from "../serviceDisplay/ServiceDisplay";

import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { TCategoryNames } from "../../types/categoryTypes/CategoryTypes";
import { AuthContext } from "../../context/authContext/AuthContext";
import AdminServiceReportsMultiple from "../../components/admin/adminServiceReports/adminServiceReportsMultiple/AdminServiceReportsMultiple";
import ServiceCommentsContainer from "../serviceCommentsContainer/ServiceCommentsContainer";

const ServiceDisplayContainer = () => {
  const location = useLocation();
  const goBackToSearch = location.state?.returnToSearch;
  const { category } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [themeColor] = useState(categoryThemes.get(category as TCategoryNames));
  const [reportsOpen, setReportsOpen] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const serviceId = findQueryParam(location.search, "id");

  const isAboveMedium = useMediaQuery("(min-width:768px)");

  const generatePathForBackClick = useMemo(
    () =>
      ((): string | number => {
        if (goBackToSearch) return -1;
        //if we are in the admin section stay in admin section
        if (location.pathname.split("/").includes("admin"))
          return "/admin/services";
        if (isAboveMedium && category) return "/services";
        return `/services/${category}`;
      })(),
    [location, isAboveMedium, category, goBackToSearch]
  );
  //scroll to top of section on service change
  useEffect(() => {
    containerRef?.current?.scrollTo({ behavior: "smooth", top: 0 });
  }, [serviceId]);

  return (
    <section
      className="overflow-auto w-full"
      //factor in the navbar height
      style={{ height: "calc(100vh - 2.5rem)" }}
      ref={containerRef}
    >
      <ServiceDisplay
        backClickPath={generatePathForBackClick}
        serviceId={serviceId}
        themeColor={themeColor ? themeColor : ThemeColor.blue}
      />
      {currentUser?.user?.privileges === "admin" && (
        <div
          className={`w-full bg-yellow-600 bg-opacity-80 ${
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
      {typeof serviceId === "string" ? (
        <ServiceCommentsContainer serviceId={serviceId} />
      ) : null}
    </section>
  );
};

export default ServiceDisplayContainer;
