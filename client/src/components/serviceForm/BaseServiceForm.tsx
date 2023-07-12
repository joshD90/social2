import { FC } from "react";
import PrimitiveInput from "../../microcomponents/inputs/PrimitiveInput";
import { TIterableService } from "../../types/serviceTypes/Service";
import SelectPrimitiveInput from "../../microcomponents/inputs/SelectPrimitiveInput";

type Props = {
  formState: TIterableService;
  updatePrimitiveField: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

const BaseServiceForm: FC<Props> = ({ formState, updatePrimitiveField }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-5 p-5">
      <PrimitiveInput
        name="name"
        label="Service Name"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.name as string}
      />
      <PrimitiveInput
        name="category"
        label="Category"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.category as string}
      />
      <PrimitiveInput
        name="maxAge"
        label="Maximum Age"
        type="number"
        updateField={updatePrimitiveField}
        value={formState.maxAge as number}
      />
      <PrimitiveInput
        name="minAge"
        label="Minimum Age"
        type="number"
        updateField={updatePrimitiveField}
        value={formState.minAge as number}
      />
      <PrimitiveInput
        name="contactNumber"
        label="Contact Number"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.contactNumber as string}
      />
      <PrimitiveInput
        name="contactEmail"
        label="Contact Email"
        type="email"
        updateField={updatePrimitiveField}
        value={formState.contactEmail as string}
      />
      <PrimitiveInput
        name="referralPathway"
        label="Referral Pathway"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.referralPathway as string}
      />
      <PrimitiveInput
        name="address"
        label="Address"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.address as string}
      />
      <PrimitiveInput
        name="forwardTo"
        label="Forward To"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.forwardTo as string}
      />
      <SelectPrimitiveInput
        name="categoryPicker"
        label="Category Picker"
        updateField={updatePrimitiveField}
        optionArray={["one", "two", "three"]}
      />
    </div>
  );
};

export default BaseServiceForm;
