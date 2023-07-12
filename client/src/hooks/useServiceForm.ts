import { useState } from "react";
import { TIterableService } from "../types/serviceTypes/Service";
import { ISubServiceCategory } from "../types/serviceTypes/SubServiceCategories";
//custom hook focussed on Service Forms - may be able to generalise
const useForm = <T extends TIterableService>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);

  const updatePrimitiveField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateSubCategoryField = (
    name: string,
    value: ISubServiceCategory[]
  ) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return { formState, updatePrimitiveField, updateSubCategoryField };
};

export default useForm;
