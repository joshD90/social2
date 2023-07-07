export interface SplitService {
  serviceBase: { [key: string]: unknown };
  subCategories: { [key: string]: unknown };
}

export const separateService = (obj: { [key: string]: unknown }) => {
  return Object.entries(obj).reduce<SplitService>(
    (result, [key, value]) => {
      if (typeof value === "object") {
        result.subCategories[key] = value;
      } else result.serviceBase[key] = value;
      return result;
    },
    { serviceBase: {}, subCategories: {} }
  );
};
