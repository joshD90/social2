import { FC } from "react";
import PrimitiveInput from "../../microcomponents/inputs/PrimitiveInput";
import { TIterableService } from "../../types/serviceTypes/Service";
import SelectPrimitiveInput from "../../microcomponents/inputs/SelectPrimitiveInput";

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
};

const BaseServiceFormExtras: FC<Props> = ({
  formState,
  updatePrimitiveField,
}) => {
  return (
    <div className="w-full grid grid-cols-2 gap-5 p-5">
      <PrimitiveInput
        name="referralPathway"
        label="Referral Pathway"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.referralPathway as string}
      />
      <PrimitiveInput
        name="imageUrl"
        label="Image of Service"
        updateField={updatePrimitiveField}
        type="text"
        value={formState.imageUrl as string}
      />
      <PrimitiveInput
        name="website"
        label="Website"
        updateField={updatePrimitiveField}
        type="text"
        value={formState.website ? (formState.website as string) : ""}
      />
      <PrimitiveInput
        name="maxCapacity"
        label="Maximum number of Service Users Catered for"
        updateField={updatePrimitiveField}
        type="number"
        value={formState.maxCapacity ? (formState.maxCapacity as number) : 0}
      />
      <SelectPrimitiveInput
        name="threshold"
        label="High or Low Threshold"
        updateField={updatePrimitiveField}
        optionArray={thresholdOptions}
      />
    </div>
  );
};

export default BaseServiceFormExtras;
