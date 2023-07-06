export interface ISubServiceCategory {
  value: string;
  exclusive: boolean;
}

export type SubServiceCategory = "areasServed" | "clientGroups" | "needsMet";
