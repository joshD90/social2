import { Request, Response } from "express";

import { db } from "../../server";
//to update the service we completely delete all the records associated with a service and then add in the updated service rather than altering the existing records for the sake of simplicity
const updateServiceController = async (req: Request, res: Response) => {
  const serviceId = parseInt(req.params.serviceId);

  if (!serviceId)
    return res.status(400).json("Needs a Service Id in the form of a number");
  const { serviceBase, subCategories } = req.body;

  if (!serviceBase || !subCategories) {
    console.log("no base or sub");
    return res.status(400).json("Not in proper format");
  }

  //this will simply delete the full service record and insert the entire new one.  Decided this will be cleaner and less likely to result in errors
  try {
    const deleteResult = await db
      .getServiceDB()
      .deleteServiceAndRelatedEntries(serviceId);
    if (deleteResult instanceof Error)
      throw Error("Could not successfully delete Service Record");
    const createResult = await db
      .getServiceDB()
      .createFullServiceEntry(serviceBase, subCategories);
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
