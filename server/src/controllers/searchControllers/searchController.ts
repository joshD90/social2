import { Request, Response } from "express";

import { db } from "../../server";

const searchController = async (req: Request, res: Response) => {
  const { searchParam } = req.body;
  if (!searchParam) return res.status(400).json("Needs a searchParam");
  const result = await db.getSearcher().searchServices(searchParam);
  res.status(200).json(result);
};

export default searchController;
