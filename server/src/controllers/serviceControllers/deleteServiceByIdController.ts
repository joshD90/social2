import { Request, Response } from "express";

import { db } from "../../server";

const deleteServiceByIdController = async (req: Request, res: Response) => {
  const serviceId = parseInt(req.params.serviceId);
  if (Number.isNaN(serviceId))
    return res.status(400).json("Service Id Provided is not a number");

  try {
    const result = await db
      .getServiceDB()
      .deleteServiceAndRelatedEntries(serviceId);
    if (result) return res.status(204);
    throw Error("There was an error in deleting this record");
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
    console.log(error);
  }
};
export default deleteServiceByIdController;
