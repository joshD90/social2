import * as Yup from "yup";
import { TIterableService } from "../../../types/serviceTypes/Service";

const categoryArray = [
  "housing",
  "mentalHealth",
  "material",
  "support groups",
  "medical",
  "financial",
  "shelter",
  "addiction",
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is Required"),
  forwardTo: Yup.string()
    .required("fowardTo is required")
    .matches(/^\S*$/, "forwardTo cannot contain spaces."),
  category: Yup.string()
    .required()
    .oneOf(categoryArray, "Not a valid category"),

  address: Yup.string().required(
    "An Address is Required, enter N/A if not applicable"
  ),
  maxAge: Yup.number()
    .positive("Can't be a negative age ya mad yoke")
    .lessThan(100, "Enter 99 if no upper limit")
    .required("Max Age is required"),
  minAge: Yup.number()
    .positive("Can't be a minus age ya mad yoke")
    .moreThan(0, "Cannot be under 0 years old ya mad yoke")
    .required("Minimum age is required"),
  contactNumber: Yup.string().required(
    "Contact Number is Required.  If not applicable enter N/A"
  ),
  contactEmail: Yup.string()
    .email("Not a valid Email")
    .required("Email is required"),
  referralPathway: Yup.string().required(
    "referralPathway is required even if it's just mimimal information"
  ),
  imageUrl: Yup.string().url("Must be a valid image link"),
  description: Yup.string().required("Description is required"),
  website: Yup.string().url("Website must be a valid link"),
  maxCapacity: Yup.number().positive(
    "Can't have a negative capacity ya mad yoke"
  ),
  threshold: Yup.string().oneOf(["low", "high"]),
  minRequirementsToAccess: Yup.string(),
});

const validateServiceForm = async (
  formData: TIterableService
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

      return { valid: false, obj: {}, errors };
    } else {
      return error as Error;
    }
  }
};

export default validateServiceForm;