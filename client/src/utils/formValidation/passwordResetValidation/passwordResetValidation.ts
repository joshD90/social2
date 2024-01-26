import * as Yup from "yup";
import { TIterableService } from "../../../types/serviceTypes/Service";

const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const passwordResetValidationSchema = Yup.object().shape({
  primary: Yup.string()
    .min(10, "Password must be at least 10 characters long")
    .matches(
      passwordRegex,
      "Password must contain at least 1 digit and 1 special character and one lowercase letter"
    )
    .required("Please give your new password"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("primary")], "Passwords must match")
    .required("Need to Supply a Confirmation PW"),
});

export const validateForm = async (
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
    console.log(result);
    return { valid: true, obj: result, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      error.inner.forEach((validationError) => {
        errors[validationError.path ? validationError.path : "null"] =
          validationError.message;
      });

      return { valid: false, obj: {}, errors };
    } else {
      return error as Error;
    }
  }
};
