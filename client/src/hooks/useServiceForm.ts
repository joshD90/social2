import { useState } from "react";
import {
  IServiceEmailContact,
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

  const updateArrayFields = <T>(name: string, value: T[]) => {
    setFormState((prev) => {
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
