import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { MdReportProblem } from "react-icons/md";

import { IServiceWithSubs } from "../../types/serviceTypes/Service";

import findQueryParam from "../../utils/queryParams/findQueryParam";
import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { categoryThemes } from "../../assets/themeColors/categoryThemes";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { TCategoryNames } from "../../types/categoryTypes/CategoryTypes";
import SubServiceDisplay from "../../components/subServiceDisplay/SubServiceDisplay";
import { mapSubServiceToISubCategory } from "./mapSubServiceToISubCategory";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import ServiceReportModal from "../../components/serviceReportModal/ServiceReportModal";

const ServiceDisplay = () => {
  const myCurrentUrl = useLocation();
  const navigate = useNavigate();
  const serviceId = findQueryParam(myCurrentUrl.search, "id");
  const { category } = useParams();

  const [reportModalVis, setReportModalVis] = useState(false);
  const [service, setService] = useState<IServiceWithSubs | null>(null);

  const isAboveMedium = useMediaQuery("(min-width:768px)");

  const [themeColor] = useState(categoryThemes.get(category as TCategoryNames));

  useEffect(() => {
    if (!serviceId) return;
    const url = `http://localhost:3500/service/service/${serviceId}`;
    const abortController = new AbortController();

    (async () => {
      try {
        const result = await fetch(url, {
          signal: abortController.signal,
          credentials: "include",
        });
        if (!result.ok) throw Error(result.statusText);
        const data = await result.json();
        const formattedData = {
          ...data.baseService[0],
          needsMet: mapSubServiceToISubCategory(data.needsMet, "needsMet"),
          clientGroups: mapSubServiceToISubCategory(
            data.clientGroups,
            "clientGroups"
          ),
          areasServed: mapSubServiceToISubCategory(
            data.areasServed,
            "areasServed"
          ),
        };

        setService(formattedData);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => abortController.abort();
  }, [serviceId]);

  const generatePathForBackClick = (): string => {
    //if we are in the admin section stay in admin section
    if (myCurrentUrl.pathname.split("/").includes("admin"))
      return "/admin/services";
    if (isAboveMedium && category) return "/services";
    return `/services/${category}`;
  };

  const toggleReportModalVis = () => {
    setReportModalVis((prev) => !prev);
  };

  return (
    <section
      className={`w-full h-full overflow-auto ${
        twThemeColors.bgDarkGradient[themeColor ? themeColor : "blue"]
      }`}
    >
      {service ? (
        <div className="relative">
          <button
            className="p-2 bg-green-500 rounded-md hover:bg-green-400 absolute left-2 text-stone-800"
            onClick={() => {
              setService(null);
              navigate(generatePathForBackClick());
            }}
          >
            Back
          </button>
          <button
            className="absolute right-4 text-stone-50 text-2xl hover:text-yellow-400 cursor-pointer"
            title="Notice Some Details Wrong with this Service?"
            onClick={toggleReportModalVis}
          >
            <MdReportProblem />
          </button>
          {reportModalVis && (
            <div className="fixed top-0 left-0">
              <ServiceReportModal
                serviceId={serviceId}
                setVisible={setReportModalVis}
              />
            </div>
          )}
          <h1 className="w-full flex justify-center mt-5 text-2xl">
            {service.name}
          </h1>
          {service.imageUrl && (
            <div className="w-full flex justify-center my-5">
              <img
                src={service.imageUrl}
                className="rounded-sm"
                style={{ maxHeight: "15rem" }}
              />
            </div>
          )}
          <div className="flex flex-col items-center">
            {service.description && (
              <p className="my-5 text-stone-50 w-4/5 text-center">
                {service.description}
              </p>
            )}
            <hr className="w-2/3 ml-auto mr-auto" />
          </div>
          <div className="p-5 grid lg:grid-cols-2 gap-3">
            <DisplayTextInfo
              name="Address"
              value={service.address}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <DisplayTextInfo
              name="Email"
              value={service.contactEmail}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <DisplayTextInfo
              name="Minimum Age"
              value={service.minAge}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <DisplayTextInfo
              name="Maximum Age"
              value={service.maxAge}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <DisplayTextInfo
              name="Referral Pathway"
              value={service.referralPathway}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <DisplayTextInfo
              name="Parent Organisation"
              value={service.organisation}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            {service.maxCapacity && (
              <DisplayTextInfo
                name="Maximum Capacity"
                value={service.maxCapacity}
                themeColor={themeColor ? themeColor : ThemeColor.blue}
              />
            )}
            {service.website && (
              <DisplayTextInfo
                name="Website"
                value={service.website}
                themeColor={themeColor ? themeColor : ThemeColor.blue}
              />
            )}
            {service.threshold && (
              <DisplayTextInfo
                name="Threshold"
                value={service.threshold}
                themeColor={themeColor ? themeColor : ThemeColor.blue}
              />
            )}
            {service.minRequirementsToAccess && (
              <DisplayTextInfo
                name="Minimum Requirements to Access"
                value={service.minRequirementsToAccess}
                themeColor={themeColor ? themeColor : ThemeColor.blue}
              />
            )}
          </div>
          <hr className="w-2/3 ml-auto mr-auto" />
          <div className="p-5 grid lg:grid-cols-2 gap-3">
            <SubServiceDisplay
              title="Needs that Service Meets"
              subServices={service.needsMet}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <SubServiceDisplay
              title="Areas that Service Covers"
              subServices={service.areasServed}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
            <SubServiceDisplay
              title="Client Groups that can Access Service"
              subServices={service.clientGroups}
              themeColor={themeColor ? themeColor : ThemeColor.blue}
            />
          </div>
        </div>
      ) : (
        "Searching for Service"
      )}
    </section>
  );
};

export default ServiceDisplay;
