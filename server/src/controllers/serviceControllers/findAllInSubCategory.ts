import { Request, Response } from "express";

import { db } from "../../server";
import { SubServiceKey } from "../../types/serviceTypes/subServiceCategories";

export const findAllInSubCategory = async (req: Request, res: Response) => {
  const { subCategory } = req.params;

  let table: SubServiceKey;
  switch (subCategory) {
    case "needsMet":
      table = SubServiceKey.NeedsMet;
      break;
    case "clientGroups":
      table = SubServiceKey.ClientGroups;
      break;
    case "areasServed":
      table = SubServiceKey.AreasServed;
      break;
    default:
      return res.status(400).json("Wrong Table Name");
  }

  const result = await db.getServiceDB().fetchAllSubCategoryEntries(table);
  if (result instanceof Error)
    return res.status(404).json("Could not Find Resources");
  res.status(200).json(result);
};
