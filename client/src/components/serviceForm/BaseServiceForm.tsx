import { FC } from "react";
import PrimitiveInput from "../../microcomponents/inputs/PrimitiveInput";

const BaseServiceForm: FC = () => {
  return (
    <div className="w-full grid grid-cols-2 gap-5 p-5">
      <PrimitiveInput name="name" label="Service Name" type="text" />
      <PrimitiveInput name="category" label="Category" type="text" />
      <PrimitiveInput name="maxAge" label="Maximum Age" type="number" />
      <PrimitiveInput name="minAge" label="Minimum Age" type="number" />
      <PrimitiveInput name="contactNumber" label="Contact Number" type="text" />
      <PrimitiveInput name="contactEmail" label="Contact Email" type="email" />
      <PrimitiveInput
        name="referralPathway"
        label="Referral Pathway"
        type="text"
      />
      <PrimitiveInput name="address" label="Address" type="text" />
      <PrimitiveInput name="forwardTo" label="Forward To" type="text" />
    </div>
  );
};

export default BaseServiceForm;
