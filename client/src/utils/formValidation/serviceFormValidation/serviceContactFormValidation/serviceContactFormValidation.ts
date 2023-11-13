import * as Yup from "yup";
import { IServicePhoneContact } from "../../../../types/serviceTypes/Service";

const validationSchema = Yup.object().shape({
  details: Yup.string().required("Contact Name or details are required"),
  phone_number: Yup.string().required("You must enter a number"),
  public: Yup.boolean().required("Include Whether this is public or not"),
});

const serviceContactFormValidation = async (contact: IServicePhoneContact) => {
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
