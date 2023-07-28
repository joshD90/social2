import * as Yup from "yup";

import { IUser, TIterableStringObj } from "../../../types/userTypes/UserTypes";

const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be in required format")
    .required("You need to enter an email"),
  firstName: Yup.string().required("You need to enter a valid first name"),
  lastName: Yup.string().required("A last name is required"),
  password: Yup.string()
    .min(10, "Password must be at least 10 characters long")
    .matches(
      passwordRegex,
      "Password must contain at least 1 digit and 1 special character and one lowercase letter"
    ),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
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

export default validateUser;
