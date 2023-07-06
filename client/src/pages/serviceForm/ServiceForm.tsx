import { useState } from "react";

import BaseServiceForm from "../../components/serviceForm/BaseServiceForm";
import ServiceSubSectionForm from "../../components/serviceForm/ServiceSubSectionForm";

import useForm from "../../hooks/useServiceForm";

const ServiceForm = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const { formState, updatePrimitiveField, updateSubCategoryField } = useForm(
    {}
  );

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

  return (
    <section className="w-full p-5">
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
          onClick={() =>
            stepIndex < 1 ? changeStepIndex(1) : console.log(formState)
          }
        >
          {stepIndex < 1 ? "Next" : "Submit"}
        </button>
      </div>
    </section>
  );
};

export default ServiceForm;
