import {
  IServiceEmailContact,
  IServicePhoneContact,
} from "../../types/serviceTypes/Service";

export interface SplitService {
  serviceBase: { [key: string]: string | number | IServicePhoneContact[] };
  contactNumber: IServicePhoneContact[];
  contactEmail: IServiceEmailContact[];
  subCategories: { [key: string]: unknown }[];
}

export const separateService = (obj: { [key: string]: unknown }) => {
  return Object.entries(obj).reduce<SplitService>(
    (result, [key, value]) => {
      if (key === "contactNumber") {
        result.contactNumber = value as IServicePhoneContact[];
      } else if (key === "contactEmail") {
        result.contactEmail = value as IServiceEmailContact[];
      } else if (typeof value === "object" && value !== null) {
        result.subCategories.push({ [key]: value });
      } else
        result.serviceBase[key] = value as
          | string
          | number
          | IServicePhoneContact[];
      return result;
    },
    { serviceBase: {}, subCategories: [], contactNumber: [], contactEmail: [] }
  );
};
