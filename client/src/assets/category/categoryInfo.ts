import {
  ICategory,
  TCategoryInfo,
  TCategoryNames,
} from "../../types/categoryTypes/CategoryTypes";

const categorySelectInfo: ICategory[] = [
  { name: "Housing", forwardTo: "housing" },
  { name: "Mental Health", forwardTo: "mentalHealth" },
  { name: "Material", forwardTo: "material" },
  { name: "Support Groups", forwardTo: "support groups" },
  { name: "Medical", forwardTo: "medical" },
  { name: "Financial", forwardTo: "financial" },
  { name: "Shelter", forwardTo: "shelter" },
  { name: "Addiction", forwardTo: "addiction" },
];

export const mappedCategorySelectInfo = categorySelectInfo.map((category) => ({
  name: category.name,
  value: category.forwardTo,
}));

export const categoryDescription = new Map<TCategoryNames, TCategoryInfo>();

categoryDescription.set("addiction", {
  name: "Addiction",
  image:
    "https://domf5oio6qrcr.cloudfront.net/medialibrary/7495/hb-addiction-0416207266121921.jpg",
  info: ["Addiction is a bad thing", "Like a Really Bad Thing"],
});
