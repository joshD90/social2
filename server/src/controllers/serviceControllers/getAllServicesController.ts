import { Request, Response } from "express";

import { db } from "../../server";

const getAllServicesController = async (req: Request, res: Response) => {
  try {
    const allServices = await db
      .getServiceDB()
      .getBaseTableQueries()
      .findEntryBy();
    if (allServices instanceof Error)
      throw Error("Issue with fetching services from DB");

    res.status(200).json(allServices);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) res.status(500).json(error.message);
  }
};

export default getAllServicesController;
