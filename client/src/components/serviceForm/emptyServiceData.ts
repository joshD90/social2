import { IServiceWithSubs } from "../../types/serviceTypes/Service";

export const emptyServiceData: IServiceWithSubs = {
  name: "",
  category: "addiction",
  description: "",
  organisation: "",
  maxAge: 0,
  minAge: 0,
  contactNumber: [],
  contactEmail: "",
  referralPathway: "",
  address: "",
  imageUrl: "",
  forwardTo: "",
  needsMet: [],
  clientGroups: [],
  areasServed: [],
};
