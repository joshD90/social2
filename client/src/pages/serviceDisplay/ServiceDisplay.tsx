import { FC, useEffect, useRef, useState } from "react";

import { IServiceWithSubs } from "../../types/serviceTypes/Service";

import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import SubServiceDisplay from "../../components/subServiceDisplay/SubServiceDisplay";
import { mapSubServiceToISubCategory } from "./mapSubServiceToISubCategory";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import ServiceOverlay from "../../components/serviceOverlay/ServiceOverlay";

type Props = {
  serviceId: string | boolean;
  themeColor: ThemeColor;
  backClickPath: string | number;
};

const ServiceDisplay: FC<Props> = ({
  serviceId,
  themeColor,
  backClickPath,
}) => {
  const [service, setService] = useState<IServiceWithSubs | null>(null);

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

  return (
    <section
      className={`w-full ${
        twThemeColors.bgDarkGradient[themeColor ? themeColor : "blue"]
      }`}
    >
      {service ? (
        <div className="relative pt-10">
          <ServiceOverlay serviceId={serviceId} backClickPath={backClickPath} />
          <h1 className="w-full flex justify-center text-2xl text-stone-50">
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
