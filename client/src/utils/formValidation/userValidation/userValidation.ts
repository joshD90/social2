import * as Yup from "yup";

import { IUser, TIterableStringObj } from "../../../types/userTypes/UserTypes";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be in required format")
    .required("You need to enter an email"),
  firstName: Yup.string().required("You need to enter a valid first name"),
  lastName: Yup.string().required("A last name is required"),
  password: Yup.string().required("You must enter a password"),
  passwordConfirm: Yup.string().required("You need to confirm the password"),
  organisation: Yup.string().required("You need to enter a valid organisation"),
});

const validateUser = async (
  formData: TIterableStringObj
): Promise<
  | {
      valid: boolean;
      obj: IUser | null;
      errors: TIterableStringObj;
    }
  | Error
> => {
  const errors: TIterableStringObj = {};

  try {
    const result = await validationSchema.validate(formData, {
      abortEarly: true,
    });
    return { valid: true, obj: result, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      error.inner.forEach((err) => {
        errors[err.path ? err.path : "null"] = err.message;
      });
      return { valid: true, obj: null, errors };
    }
    return error as Error;
  }
};

export default validateUser;
