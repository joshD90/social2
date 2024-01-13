import { Request, Response } from "express";

import { db } from "../../server";
import { ExtendedRowDataPacket } from "../../types/mySqlTypes/mySqlTypes";
import { RowDataPacket } from "mysql2";

const getAllServicesController = async (req: Request, res: Response) => {
  const { minimal } = req.query;
  try {
    let allServices: ExtendedRowDataPacket<unknown>[] | RowDataPacket[];
    if (!minimal) {
      allServices = await db.getServiceDB().fetchAllServices();
    } else {
      allServices = await db.getServiceDB().fetchServicesMinimal();
    }

    res.status(200).json(allServices);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) res.status(500).json(error.message);
  }
};

export default getAllServicesController;
