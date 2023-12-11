import { FC } from "react";
import { TIterableService } from "../../types/serviceTypes/Service";
import { ISubServiceCategory } from "../../types/serviceTypes/SubServiceCategories";
import FormSubSelector from "../formSubSelector/FormSubSelector";

type Props = {
  formState: TIterableService;
  updateField: <T>(name: string, value: T[]) => void;
};

const ServiceSubSectionForm: FC<Props> = ({ updateField, formState }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <FormSubSelector
        subCategoryName="areasServed"
        updateField={updateField}
        value={formState.areasServed as ISubServiceCategory[]}
      />
      <FormSubSelector
        subCategoryName="clientGroups"
        updateField={updateField}
        value={formState.clientGroups as ISubServiceCategory[]}
      />
      <FormSubSelector
        subCategoryName="needsMet"
        updateField={updateField}
        value={formState.needsMet as ISubServiceCategory[]}
      />
    </div>
  );
};

export default ServiceSubSectionForm;
