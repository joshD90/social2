import * as Yup from "yup";
import {
  IServiceEmailContact,
  IServicePhoneContact,
} from "../../../../types/serviceTypes/Service";

const phoneValidationSchema = Yup.object().shape({
  details: Yup.string().required("Contact Name or details are required"),
  phone_number: Yup.string().required("You must enter a number"),
  public: Yup.boolean().required("Include Whether this is public or not"),
});

const emailValidationSchema = Yup.object().shape({
  details: Yup.string().required("Contact Name or details are required"),
  email: Yup.string()
    .required("You must enter an email")
    .email("This is not a correct email format"),
});

const serviceContactFormValidation = async (
  contact: IServicePhoneContact | IServiceEmailContact
) => {
  const validationSchema =
    "phone_number" in contact ? phoneValidationSchema : emailValidationSchema;
  try {
    const result = await validationSchema.validate(contact, {
      abortEarly: false,
    });
    return { valid: true, obj: result, errors: {} };
  } catch (error) {
    const validationErrors: { [key: string]: string } = {};
    if (error instanceof Yup.ValidationError) {
      error.inner.forEach(
        (validationError) =>
          (validationErrors[
            validationError.path ? validationError.path : "null"
          ] = validationError.message)
      );
      return { valid: false, obj: {}, errors: validationErrors };
    } else {
      console.log(error);
      return error as Error;
    }
  }
};

export default serviceContactFormValidation;
