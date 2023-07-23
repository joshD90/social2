import { Request, Response } from "express";

import { db } from "../../server";

const updateServiceController = async (req: Request, res: Response) => {
  const serviceId = parseInt(req.params.serviceId);
  if (!serviceId)
    return res.status(400).json("Needs a Service Id in the form of a number");
  const baseService = req.body.baseService;
  const subCategories = req.body.subCategories;
  if (!baseService || !subCategories)
    return res.status(400).json("Not in proper format");
  //this will simply delete the full service record and insert the entire new one.  Decided this will be cleaner and less likely to result in errors
  try {
    const deleteResult = await db
      .getServiceDB()
      .deleteServiceAndRelatedEntries(serviceId);
    if (deleteResult instanceof Error)
      throw Error("Could not successfully delete Service Record");
    const createResult = await db
      .getServiceDB()
      .createFullServiceEntry(baseService, subCategories);
    if (createResult instanceof Error)
      throw Error(
        "Service was deleted in preparation however an error occured when trying to add in updated version"
      );
    res
      .status(200)
      .json({ id: createResult.insertId, message: "Successfully updated" });
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default updateServiceController;
