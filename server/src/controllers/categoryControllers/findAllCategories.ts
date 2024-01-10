import { Request, Response } from "express";

import { db } from "../../server";

export const findAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await db.getCategoryDB().getCategoryQueries().findEntryBy();

    const mappedResult = result.map((category) => ({
      ...category,
      name: category.categoryName,
    }));
    res.status(200).json(mappedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
