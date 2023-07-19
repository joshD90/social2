import {
  ISubServiceCategory,
  SubServiceCategory,
} from "../../types/serviceTypes/SubServiceCategories";

export const mapSubServiceToISubCategory = (
  subServices: { [key: string]: string | number }[],
  type: SubServiceCategory
): ISubServiceCategory[] => {
  {
    const mappedServices = subServices.map((item) => {
      const key = createKey(type);

      let value = "";
      let exclusive = false;
      if (typeof item[key] === "string") value = item[key] as string;
      exclusive = item.exclusive === 1 ? true : false;

      return { value, exclusive };
    });
    return mappedServices;
  }
};

export const createKey = (category: SubServiceCategory): string => {
  switch (category) {
    case "needsMet":
      return "need";
    case "areasServed":
      return "area";
    case "clientGroups":
      return "groupName";
  }
};
