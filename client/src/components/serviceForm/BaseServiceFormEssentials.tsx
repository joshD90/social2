import { FC, SetStateAction } from "react";
import PrimitiveInput from "../../microcomponents/inputs/PrimitiveInput";
import {
  IServicePhoneContact,
  TIterableService,
} from "../../types/serviceTypes/Service";
import SelectPrimitiveInput from "../../microcomponents/inputs/SelectPrimitiveInput";
import TextAreaInput from "../../microcomponents/inputs/TextAreaInput";
import { mappedCategorySelectInfo } from "../../assets/category/categoryInfo";
import SelectParentService from "./selectParentService/SelectParentService";
import ServiceContactInput from "./serviceContactInput/ServiceContactInput";
import { ISubServiceCategory } from "../../types/serviceTypes/SubServiceCategories";

type Props = {
  formState: TIterableService;
  updatePrimitiveField: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  updateArrayField: (
    name: string,
    value: ISubServiceCategory[] | IServicePhoneContact[]
  ) => void;
  inputErrors: { [key: string]: string };
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
};

const BaseServiceForm: FC<Props> = ({
  formState,
  updatePrimitiveField,
  updateArrayField,
  inputErrors,
  setInputErrors,
}) => {
  return (
    <div className="w-full grid grid-cols-2 gap-5 p-5 ">
      <PrimitiveInput
        name="name"
        label="Service Name"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.name as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
      <div className="flex gap-2">
        <PrimitiveInput
          name="minAge"
          label="Minimum Age"
          type="number"
          updateField={updatePrimitiveField}
          value={formState.minAge as number}
          inputError={inputErrors}
          setInputError={setInputErrors}
        />
        <PrimitiveInput
          name="maxAge"
          label="Maximum Age"
          type="number"
          updateField={updatePrimitiveField}
          value={formState.maxAge as number}
          inputError={inputErrors}
          setInputError={setInputErrors}
        />
      </div>
      {/* <PrimitiveInput
        name="contactNumber"
        label="Contact Number"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.contactNumber as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      /> */}

      <PrimitiveInput
        name="contactEmail"
        label="Contact Email"
        type="email"
        updateField={updatePrimitiveField}
        value={formState.contactEmail as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
      <PrimitiveInput
        name="address"
        label="Address"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.address as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
      <PrimitiveInput
        name="forwardTo"
        label="Forward To"
        type="text"
        updateField={updatePrimitiveField}
        value={formState.forwardTo as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
      <SelectPrimitiveInput
        name="category"
        label="Category Picker"
        updateField={updatePrimitiveField}
        optionArray={mappedCategorySelectInfo}
        value={formState.category as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
      <SelectParentService
        updateField={updatePrimitiveField}
        value={formState.parent as string}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
      <ServiceContactInput
        value={
          (formState.contactNumber as unknown as IServicePhoneContact[]) ?? []
        }
        updateField={updateArrayField}
        fieldName="contactNumber"
      />
      <TextAreaInput
        size={{ cols: 40, rows: 10 }}
        label="Description of the Service"
        value={formState.description as string}
        name="description"
        updateField={updatePrimitiveField}
        gridSpan={2}
        inputError={inputErrors}
        setInputError={setInputErrors}
      />
    </div>
  );
};

export default BaseServiceForm;
