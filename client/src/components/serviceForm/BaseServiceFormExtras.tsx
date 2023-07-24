import { FC } from "react";
import PrimitiveInput from "../../microcomponents/inputs/PrimitiveInput";
import { TIterableService } from "../../types/serviceTypes/Service";
import SelectPrimitiveInput from "../../microcomponents/inputs/SelectPrimitiveInput";
import TextAreaInput from "../../microcomponents/inputs/TextAreaInput";

const thresholdOptions = [
  { value: "low", name: "Low" },
  { value: "high", name: "High" },
];

type Props = {
  formState: TIterableService;
  updatePrimitiveField: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  inputErrors: { [key: string]: string };
};

const BaseServiceFormExtras: FC<Props> = ({
  formState,
  updatePrimitiveField,
  inputErrors,
}) => {
  return (
    <div className="w-full grid lg:grid-cols-2 gap-5 p-5">
      <PrimitiveInput
        name="referralPathway"
        label="Referral Pathway"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.referralPathway as string}
        inputError={inputErrors}
      />
      <PrimitiveInput
        name="imageUrl"
        label="Image of Service"
        updateField={updatePrimitiveField}
        type="text"
        value={formState.imageUrl as string}
        inputError={inputErrors}
      />
      <PrimitiveInput
        name="website"
        label="Website"
        updateField={updatePrimitiveField}
        type="text"
        value={formState.website ? (formState.website as string) : ""}
        inputError={inputErrors}
      />
      <PrimitiveInput
        name="maxCapacity"
        label="Maximum number of Service Users Catered for"
        updateField={updatePrimitiveField}
        type="number"
        value={formState.maxCapacity ? (formState.maxCapacity as number) : 0}
        inputError={inputErrors}
      />
      <SelectPrimitiveInput
        name="threshold"
        label="High or Low Threshold"
        updateField={updatePrimitiveField}
        optionArray={thresholdOptions}
        value={formState.threshold as string}
        inputError={inputErrors}
      />
      <TextAreaInput
        label="The minimum requirements needed to access service"
        name="minRequirementsToAccess"
        size={{ cols: 2, rows: 5 }}
        value={formState.minimumRequirementsToAccess as string}
        updateField={updatePrimitiveField}
      />
    </div>
  );
};

export default BaseServiceFormExtras;
