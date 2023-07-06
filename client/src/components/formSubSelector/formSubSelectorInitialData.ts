import {
  ISubServiceCategory,
  SubServiceCategory,
} from "../../types/serviceTypes/SubServiceCategories";

const needsMetData: ISubServiceCategory[] = [
  { value: "medical", exclusive: false },
  { value: "shelter", exclusive: false },
  { value: "food", exclusive: false },
  { value: "clothing", exclusive: false },
  { value: "storage", exclusive: false },
  { value: "addiction", exclusive: false },
  { value: "emotional", exclusive: false },
  { value: "housing", exclusive: false },
];

const clientGroupsData: ISubServiceCategory[] = [
  { value: "travellers", exclusive: false },
  { value: "male", exclusive: false },
  { value: "alcohol", exclusive: false },
  { value: "drugs", exclusive: false },
  { value: "adults", exclusive: false },
  { value: "female", exclusive: false },
];

const areasServedData: ISubServiceCategory[] = [
  { value: "DCC", exclusive: false },
  { value: "DLRDCC", exclusive: false },
  { value: "SDCC", exclusive: false },
  { value: "Fingal", exclusive: false },
];

const subServiceDataMap = new Map<SubServiceCategory, ISubServiceCategory[]>();
subServiceDataMap
  .set("areasServed", areasServedData)
  .set("clientGroups", clientGroupsData)
  .set("needsMet", needsMetData);

export default subServiceDataMap;
