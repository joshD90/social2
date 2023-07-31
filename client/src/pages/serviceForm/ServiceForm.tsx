import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BaseServiceFormEssentials from "../../components/serviceForm/BaseServiceFormEssentials";
import ServiceSubSectionForm from "../../components/serviceForm/ServiceSubSectionForm";

import useForm from "../../hooks/useServiceForm";
import { separateService } from "../../utils/objectSeperation/separateService";
import { TIterableService } from "../../types/serviceTypes/Service";
import useGetFetch from "../../hooks/useGetFetch";

import { mapSubServiceToISubCategory } from "../serviceDisplay/mapSubServiceToISubCategory";
import BaseServiceFormExtras from "../../components/serviceForm/BaseServiceFormExtras";
import validateServiceForm from "../../utils/formValidation/serviceFormValidation/serviceFormValidation";

const ServiceForm = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
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
  const navigate = useNavigate();

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
          <BaseServiceFormEssentials
            updatePrimitiveField={updatePrimitiveField}
            formState={formState}
            inputErrors={inputError}
          />
        );
      case 1:
        return (
          <BaseServiceFormExtras
            formState={formState}
            updatePrimitiveField={updatePrimitiveField}
            inputErrors={inputError}
          />
        );
      case 2:
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
      if (newAmount < 0 || newAmount > 2) return prev;
      return newAmount;
    });
  };
  //could this all be abstracted into a custom hook / function? probably just easiest to seperate into a function maybe
  const submitForm = async () => {
    //seperate our form information into two seperate parts
    const serviceToSend = separateService(formState);
    //validate our form
    const validationResult = await validateServiceForm(
      serviceToSend.serviceBase
    );

    if (validationResult instanceof Error) return;
    if (!validationResult.valid) {
      return setInputError(validationResult.errors);
    }

    const url = serviceId
      ? `http://localhost:3500/service/${serviceId}`
      : "http://localhost:3500/service";
    const method = serviceId ? "PUT" : "POST";
    try {
      const result = await fetch(url, {
        method: method,
        body: JSON.stringify(serviceToSend),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!result.ok)
        throw new Error(`Request failed with status code of ${result.status}`);
      const data = await result.json();
      navigate(`/admin/services/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full p-5 bg-stone-800 min-h-screen">
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
          onClick={() => (stepIndex < 2 ? changeStepIndex(1) : submitForm())}
        >
          {stepIndex < 2 ? "Next" : "Submit"}
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
