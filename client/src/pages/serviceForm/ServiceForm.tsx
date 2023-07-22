import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BaseServiceForm from "../../components/serviceForm/BaseServiceForm";
import ServiceSubSectionForm from "../../components/serviceForm/ServiceSubSectionForm";

import useForm from "../../hooks/useServiceForm";
import { separateService } from "../../utils/objectSeperation/separateService";
import { TIterableService } from "../../types/serviceTypes/Service";
import useGetFetch from "../../hooks/useGetFetch";

import { mapSubServiceToISubCategory } from "../serviceDisplay/mapSubServiceToISubCategory";

const ServiceForm = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const {
    formState,
    updatePrimitiveField,
    updateSubCategoryField,
    setFormState,
  } = useForm<TIterableService>({});
  const { serviceId } = useParams();
  const { fetchedData } = useGetFetch(
    serviceId ? `http://localhost:3500/service/service/${serviceId}` : ""
  );

  useEffect(() => {
    //we dont need to do this if we dont have an edit id or if we haven't fetched the data yet
    if (!serviceId || !fetchedData) return;

    const formattedData = generateFormattedData(fetchedData);
    if (!formattedData) return;

    setFormState(formattedData);
  }, [fetchedData, serviceId, setFormState]);

  //this will render our multistep form depending on the stage we are at
  const renderStepComponent = () => {
    switch (stepIndex) {
      case 0:
        return (
          <BaseServiceForm
            updatePrimitiveField={updatePrimitiveField}
            formState={formState}
          />
        );
      case 1:
        return (
          <ServiceSubSectionForm
            formState={formState}
            updateField={updateSubCategoryField}
          />
        );
    }
  };

  //increment or decrement which step of the form we are at
  const changeStepIndex = (changeAmount: 1 | -1) => {
    setStepIndex((prev) => {
      const newAmount = prev + changeAmount;
      if (newAmount < 0 || newAmount > 1) return prev;
      return newAmount;
    });
  };

  const submitForm = async () => {
    //seperate our form information into two seperate parts
    const serviceToSend = separateService(formState);

    try {
      const result = await fetch("http://localhost:3500/service", {
        method: "POST",
        body: JSON.stringify(serviceToSend),
        headers: { "Content-Type": "application/json" },
      });
      if (!result.ok)
        throw new Error(`Request failed with status code of ${result.status}`);
      const data = await result.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full p-5 bg-stone-600 min-h-screen">
      {renderStepComponent()}
      <div className="flex justify-between w-full pt-10">
        <button
          className="p-2 bg-stone-500 rounded-md hover:bg-stone-400"
          onClick={() => changeStepIndex(-1)}
          disabled={stepIndex === 0 ? true : false}
        >
          Previous
        </button>
        <button
          className="p-2 bg-stone-500 rounded-md hover:bg-stone-400"
          onClick={() => (stepIndex < 1 ? changeStepIndex(1) : submitForm())}
        >
          {stepIndex < 1 ? "Next" : "Submit"}
        </button>
      </div>
    </section>
  );
};

export default ServiceForm;

const generateFormattedData = (
  fetchedData: unknown
): TIterableService | false => {
  if (!fetchedData) return false;
  if (
    typeof fetchedData === "object" &&
    "baseService" in fetchedData &&
    "clientGroups" in fetchedData &&
    "needsMet" in fetchedData &&
    "areasServed" in fetchedData
  ) {
    if (Array.isArray(fetchedData.baseService) && fetchedData.baseService[0]) {
      return {
        ...fetchedData.baseService[0],
        clientGroups: mapSubServiceToISubCategory(
          fetchedData.clientGroups as { [key: string]: string | number }[],
          "clientGroups"
        ),
        needsMet: mapSubServiceToISubCategory(
          fetchedData.needsMet as { [key: string]: string | number }[],
          "needsMet"
        ),
        areasServed: mapSubServiceToISubCategory(
          fetchedData.areasServed as { [key: string]: string | number }[],
          "areasServed"
        ),
      };
    }
  }
  return false;
};
