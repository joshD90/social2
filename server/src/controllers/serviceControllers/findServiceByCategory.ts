import { Request, Response } from "express";

import { db } from "../../server";

export const findServicesByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  if (!category)
    return res
      .status(400)
      .json("You need to include a category as part of params");

  try {
    const result = await db
      .getServiceDB()
      .getBaseTableQueries()
      .findEntryBy("category", category);
    if (result instanceof Error) throw Error(result.message);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
