import { FC, useEffect, useState } from "react";

import { IServiceWithChildren } from "../../types/serviceTypes/Service";

import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import SubServiceDisplay from "../../components/subServiceDisplay/SubServiceDisplay";
import { mapSubServiceToISubCategory } from "./mapSubServiceToISubCategory";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import ServiceOverlay from "../../components/serviceOverlay/ServiceOverlay";
import envIndex from "../../envIndex/envIndex";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsGlobe } from "react-icons/bs";
import ServiceChildContainer from "../../components/serviceChildContainer/ServiceChildContainer";
import ServiceContactDisplay from "../../components/serviceContactDisplay/ServiceContactDisplay";
import ServiceImageDisplay from "../../components/serviceImageDisplay/ServiceImageDisplay";
import ServiceFileDisplay from "../../components/serviceFileDisplay/ServiceFileDisplay";

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
  const [service, setService] = useState<IServiceWithChildren | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    const url = `${envIndex.urls.baseUrl}/services/service/${serviceId}`;
    const abortController = new AbortController();

    (async () => {
      try {
        const result = await fetch(url, {
          signal: abortController.signal,
          credentials: "include",
        });
        if (!result.ok) throw Error(result.statusText);
        const data = await result.json();
        console.log(data, "data returned from service searched");
        const contactNumber =
          Array.isArray(data.contactNumber) && data.contactNumber.length > 0
            ? data.contactNumber
            : data.baseService[0].contactNumber;
        const contactEmail =
          Array.isArray(data.emailContacts) && data.emailContacts.length > 0
            ? data.emailContacts
            : data.baseService[0].contactEmail;

        const formattedData = {
          ...data.baseService[0],
          contactNumber,
          contactEmail,
          children: data.children,
          needsMet: mapSubServiceToISubCategory(data.needsMet, "needsMet"),
          clientGroups: mapSubServiceToISubCategory(
            data.clientGroups,
            "clientGroups"
          ),
          areasServed: mapSubServiceToISubCategory(
            data.areasServed,
            "areasServed"
          ),
          imageUrls: Array.isArray(data.images)
            ? (data.images as { main_pic: boolean | undefined }[])?.sort(
                (a, b) => {
                  if (a.main_pic && !b.main_pic) return -1;
                  if (!a.main_pic && b.main_pic) return 1;
                  return 0;
                }
              ) ?? []
            : [],
          serviceFiles: data.files ?? [],
        };
        console.log(formattedData.serviceFiles);
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
          <h1 className="w-full flex justify-center text-2xl text-stone-50">
            {service.name}
          </h1>
          {!service.imageUrls && service.imageUrl && (
            <div className="w-full flex justify-center my-5 z-0">
              <img
                src={service.imageUrl}
                className="rounded-sm"
                style={{ maxHeight: "15rem" }}
              />
            </div>
          )}
          {service.imageUrls && (
            <div className="w-full sm:px-10">
              <ServiceImageDisplay images={service.imageUrls} />
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
          <div className="p-5 grid lg:grid-cols-2 gap-3 text-stone-50">
            <div className="lg:col-span-2 flex justify-between items-start flex-col sm:flex-row">
              <div className="flex flex-col gap-2">
                {/* While we transition to the proper numbers we will keep this in so that we dont have to worr about it breaking for the old services */}
                {typeof service.contactNumber === "string" ? (
                  <div className="flex items-center justify-start gap-5">
                    <FaPhoneAlt />
                    <span>{service.contactNumber}</span>
                  </div>
                ) : null}

                {typeof service.contactEmail === "string" ? (
                  <div className="flex items-center justify-start gap-5">
                    <MdEmail />
                    <span>{service.contactEmail}</span>
                  </div>
                ) : null}

                {service.website && (
                  <div className="flex items-center justify-start gap-5">
                    <BsGlobe />
                    <a href={service.website} target="_blank">
                      {service.website}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-start gap-5">
                <FaMapMarkerAlt />
                <span>{service.address}</span>
              </div>
            </div>
            {/* Special Contacts */}
            {Array.isArray(service.contactNumber) ? (
              <ServiceContactDisplay
                contacts={service.contactNumber}
                color={themeColor ? themeColor : ThemeColor.blue}
              />
            ) : null}
            {Array.isArray(service.contactEmail) ? (
              <ServiceContactDisplay
                contacts={service.contactEmail}
                color={themeColor ? themeColor : ThemeColor.blue}
              />
            ) : null}

            <DisplayTextInfo
              name="Address"
              value={service.address}
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
            {service.parent_service_id ? (
              <DisplayTextInfo
                name="Parent Organisation"
                value={service.parent_service_id}
                themeColor={themeColor ? themeColor : ThemeColor.blue}
              />
            ) : null}

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

            {service.children && service.children.length !== 0 ? (
              <ServiceChildContainer
                childServices={service.children}
                themeColor={themeColor}
              />
            ) : null}
            {Array.isArray(service.serviceFiles) &&
              service.serviceFiles.length > 0 && (
                <ServiceFileDisplay
                  files={service.serviceFiles}
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
          <ServiceOverlay serviceId={serviceId} backClickPath={backClickPath} />
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          Looking for Service...
        </div>
      )}
    </section>
  );
};

export default ServiceDisplay;
