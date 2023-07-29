import * as Yup from "yup";
import { TIterableStringObj } from "../../../types/userTypes/UserTypes";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email cannot be blank")
    .email("Must be a valid email format"),
  password: Yup.string().required("A Password is required"),
});

const validateLoginDetails = async (
  formData: TIterableStringObj
): Promise<
  | {
      valid: boolean;
      obj: { email: string; password: string } | null;
      errors: TIterableStringObj;
    }
  | Error
> => {
  const errors: TIterableStringObj = {};

  try {
    const result = await validationSchema.validate(formData, {
      abortEarly: false,
    });

    return { valid: true, obj: result, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      console.log(error.inner, "inner");
      error.inner.forEach((err) => {
        console.log(err);
        errors[err.path ? err.path : "null"] = err.message;
      });

      return { valid: false, obj: null, errors };
    }

    return error as Error;
  }
};

export default validateLoginDetails;
