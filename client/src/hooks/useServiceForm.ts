import { useState } from "react";
import {
  IServicePhoneContact,
  TIterableService,
} from "../types/serviceTypes/Service";
import { ISubServiceCategory } from "../types/serviceTypes/SubServiceCategories";
//custom hook focussed on Service Forms - may be able to generalise
const useForm = <T extends TIterableService>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);

  const updatePrimitiveField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateArrayFields = (
    name: string,
    value: ISubServiceCategory[] | IServicePhoneContact[]
  ) => {
    console.log(name, "name is updateArrayFields");
    console.log(`${name} field shouldl be updating`);
    setFormState((prev) => {
      console.log(prev, "prev in setFormState in updateArrayFields");
      return { ...prev, [name]: value };
    });
  };

  return {
    formState,
    updatePrimitiveField,
    updateArrayFields,
    setFormState,
  };
};

export default useForm;
