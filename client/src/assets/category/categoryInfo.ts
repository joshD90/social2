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
  { name: "LGBTQI+", forwardTo: "lgbt" },
  { name: "Minorities", forwardTo: "minorities" },
  { name: "Education and Employment", forwardTo: "educationEmployment" },
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
  info: [
    "Addiction can be one of the major barriers for people exiting homelessness",
    "Typically it can run co-morbidly with other issues",
    "Addiction Services can cater to people experiencing addiction in a number of different ways.  Firstly Harm Reduction practices can remove a sense of the chaotic use involved and minimise the harm caused by addiction while the person is still trying to figure out what they wish to do.  Secondly community treatment services can support a person exit their addiction.  Some cases require inpatient detox and rehabilitation services for a person to exit.  ",
    "As from the housing first model, addiction services are unlikely to have a long lasting impact should other stability ensuring aspects not be available such as a place to call home.",
  ],
});

categoryDescription.set("housing", {
  name: "Housing",
  image:
    "https://www.irishexaminer.com/cms_media/module_img/3160/1580330_1_articlelarge_ie-436588_f6c5ad92e8344c24b1df5822e966fefd.jpg",
  info: [
    "Housing in this Context refers to services who's primary purpose is to move you to permanent housing where you have your own key to the property",
    "This should not be confused with services who provide shelter such as STA's or TEA's",
  ],
});

categoryDescription.set("shelter", {
  name: "Shelter",
  image: "https://img2.thejournal.ie/inline/3131478/original/?width=605",
  info: [
    "These are services that give people accommodation be it short term or longer term",
    "These services should not be confused with services where the primary goal is Housing such as DCC, Housing First etc",
  ],
});

categoryDescription.set("mentalHealth", {
  name: "Mental Health",
  image:
    "https://ca-times.brightspotcdn.com/dims4/default/43ac27c/2147483647/strip/true/crop/2000x1333+0+0/resize/1024x682!/format/webp/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F8e%2Fb7%2F99beae9a4be0bbced1487b04b619%2Fla-hm-nyny-mental-health.jpg",
  info: ["Services primarily dealing with Mental Health issues"],
});

categoryDescription.set("financial", {
  name: "Financial",
  image: "https://img.rasset.ie/00161026-800.jpg",
  info: [
    "Services primarily dealing with financial advice or financial supports",
  ],
});

categoryDescription.set("medical", {
  name: "Medical",
  image: "https://img.rasset.ie/00182f65-800.jpg",
  info: ["Services primarily dealing with Medical Supports"],
});

categoryDescription.set("material", {
  name: "Material",
  image:
    "https://potatorolls.com/wp-content/uploads/2020/10/Chicken-Pesto-Panini-960x640.jpg",
  info: [
    "Services that primarily seek to provide homeless people with material items such as food and clothing or other material that they may need such as blankets or sleeping bags",
  ],
});
