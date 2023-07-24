export interface SplitService {
  serviceBase: { [key: string]: string | number };
  subCategories: { [key: string]: unknown }[];
}

export const separateService = (obj: { [key: string]: unknown }) => {
  return Object.entries(obj).reduce<SplitService>(
    (result, [key, value]) => {
      if (typeof value === "object" && value !== null) {
        result.subCategories.push({ [key]: value });
      } else result.serviceBase[key] = value as string | number;
      return result;
    },
    { serviceBase: {}, subCategories: [] }
  );
};
