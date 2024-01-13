import { Request, Response } from "express";

import { db } from "../../server";

const searchController = async (req: Request, res: Response) => {
  const { searchParam } = req.body;
  if (!searchParam) return res.status(400).json("Needs a searchParam");

  try {
    const result = await db.getSearcher().searchServices(searchParam);
    if (result.length === 0)
      return res.status(404).json("Could not find any matching criteria");
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json("There was an unexpected Error with database");
  }
};

export default searchController;
