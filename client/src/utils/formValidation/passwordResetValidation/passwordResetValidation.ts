import * as Yup from "yup";
import { TIterableService } from "../../../types/serviceTypes/Service";

const validateForm = async (
  formData: TIterableService,
  validationSchema: Yup.ObjectSchema<Yup.AnyObject>
): Promise<
  | { valid: boolean; obj: TIterableService; errors: { [key: string]: string } }
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
      error.inner.forEach((validationError) => {
        errors[validationError.path ? validationError.path : "null"] =
          validationError.message;
      });
      console.log(errors, "errors");
      return { valid: false, obj: {}, errors };
    } else {
      return error as Error;
    }
  }
};

export default validateForm;
