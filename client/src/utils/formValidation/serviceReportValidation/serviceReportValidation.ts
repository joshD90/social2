import * as Yup from "yup";
import { TIterableStringObj } from "../../../types/userTypes/UserTypes";

const validationSchema = Yup.object().shape({
  inaccuracyDesc: Yup.string()
    .min(50, "Please be more descriptive")
    .required("Please enter a value for this"),
});

export const validateServiceReport = async (
  formData: TIterableStringObj
): Promise<
  | {
      valid: boolean;
      obj: TIterableStringObj;
      errors: { [key: string]: string };
    }
  | Error
> => {
  const errors: { [key: string]: string } = {};
  try {
    const result = await validationSchema.validate(formData, {
      abortEarly: false,
    });
    return { valid: true, obj: result, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      error.inner.forEach(
        (validationError) =>
          (errors[validationError.path ? validationError.path : "null"] =
            validationError.message)
      );
      return { valid: false, obj: {}, errors: errors };
    } else {
      return error as Error;
    }
  }
};
