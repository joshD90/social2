import { IServicePhoneContact } from "../../types/serviceTypes/Service";

export interface SplitService {
  serviceBase: { [key: string]: string | number | IServicePhoneContact[] };
  contactNumber: IServicePhoneContact[];
  subCategories: { [key: string]: unknown }[];
}

export const separateService = (obj: { [key: string]: unknown }) => {
  return Object.entries(obj).reduce<SplitService>(
    (result, [key, value]) => {
      if (key === "contactNumber") {
        result.contactNumber = value as IServicePhoneContact[];
      } else if (typeof value === "object" && value !== null) {
        result.subCategories.push({ [key]: value });
      } else
        result.serviceBase[key] = value as
          | string
          | number
          | IServicePhoneContact[];
      return result;
    },
    { serviceBase: {}, subCategories: [], contactNumber: [] }
  );
};
