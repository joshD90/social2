import { Request, Response } from "express";

import { db } from "../../server";
import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";
import { RowDataPacket } from "mysql2";

const getAllServicesController = async (req: Request, res: Response) => {
  const { minimal } = req.query;
  try {
    let allServices: Error | ExtendedRowDataPacket<unknown>[] | RowDataPacket[];
    if (!minimal) {
      allServices = await db.getServiceDB().getBaseTableQueries().findEntryBy();
    } else {
      allServices = await db.getServiceDB().fetchServicesMinimal();
    }
    if (allServices instanceof Error)
      throw Error("Issue with fetching services from DB");

    res.status(200).json(allServices);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) res.status(500).json(error.message);
  }
};

export default getAllServicesController;
