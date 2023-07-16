import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { IServiceWithSubs } from "../../types/serviceTypes/Service";

import findQueryParam from "../../utils/queryParams/findQueryParam";
import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { categoryThemes } from "../../assets/themeColors/categoryThemes";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { TCategoryNames } from "../../types/categoryTypes/CategoryTypes";
import SubServiceDisplay from "../../components/subServiceDisplay/SubServiceDisplay";
import {
  ISubServiceCategory,
  SubServiceCategory,
} from "../../types/serviceTypes/SubServiceCategories";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const ServiceDisplay = () => {
  const myCurrentUrl = useLocation();
  const navigate = useNavigate();
  const serviceId = findQueryParam(myCurrentUrl.search, "id");
  const { category } = useParams();

  const [service, setService] = useState<IServiceWithSubs | null>(null);

  const isAboveMedium = useMediaQuery("(min-width:768px)");

  const [themeColor, setThemeColor] = useState(
    categoryThemes.get(category as TCategoryNames)
  );

  console.log(themeColor, category);

  useEffect(() => {
    const url = `http://localhost:3500/service/service/${serviceId}`;
    const abortController = new AbortController();

    (async () => {
      try {
        const result = await fetch(url, { signal: abortController.signal });
        if (!result.ok) throw Error(result.statusText);
        const data = await result.json();
        const formattedData = {
          ...data.baseService[0],
          needsMet: mappedSubService(data.needsMet, "needsMet"),
          clientGroups: mappedSubService(data.clientGroups, "clientGroups"),
          areasServed: mappedSubService(data.areasServed, "areasServed"),
        };

        setService(formattedData);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => abortController.abort();
  }, [serviceId]);

  return (
    <section className="w-full h-full overflow-auto">
      {service ? (
        <div className="relative">
          {!isAboveMedium && (
            <button
              className="p-2 bg-green-500 rounded-md hover:bg-green-400 absolute left-2"
              onClick={() => navigate(`/services/${category}`)}
            >
              Back
            </button>
          )}
          <h1 className="w-full flex justify-center mt-5 text-2xl">
            {service.name}
          </h1>
          {service.imageUrl && <img src={service.imageUrl} />}
          <div className="p-5 grid lg:grid-cols-2 gap-5">
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

const mappedSubService = (
  subServices: { [key: string]: string | boolean }[],
  type: SubServiceCategory
): ISubServiceCategory[] => {
  {
    const mappedServices = subServices.map((item) => {
      const key = createKey(type);
      let value = "";
      let exclusive = false;
      if (typeof item[key] === "string") value = item[key] as string;
      if (typeof item[key] === "boolean") exclusive = item[key] as boolean;

      return { value, exclusive };
    });
    return mappedServices;
  }
};

const createKey = (category: SubServiceCategory): string => {
  switch (category) {
    case "needsMet":
      return "need";
    case "areasServed":
      return "area";
    case "clientGroups":
      return "groupName";
  }
};
