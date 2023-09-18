import { Request, Response } from "express";

import { db } from "../../server";

const searchController = async (req: Request, res: Response) => {
  const { searchParam } = req.body;
  if (!searchParam) return res.status(400).json("Needs a searchParam");
  const result = await db.getSearcher().searchServices(searchParam);
  if (result instanceof Error)
    return res.status(500).json("There was an unexpected Error with database");
  if (result.length === 0)
    return res.status(404).json("Could not find any matching criteria");
  res.status(200).json(result);
};

export default searchController;
