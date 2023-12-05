import { Request, Response } from "express";

import { db } from "../../server";
import { IUser } from "../../types/userTypes/UserType";
//to update the service we completely delete all the records associated with a service and then add in the updated service rather than altering the existing records for the sake of simplicity
const updateServiceController = async (req: Request, res: Response) => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(401)
      .json("You are not Authorised to Update a Service. Must be an admin");

  const serviceId = parseInt(req.params.serviceId);

  if (!serviceId)
    return res.status(400).json("Needs a Service Id in the form of a number");
  const { serviceBase, subCategories, contactNumber, contactEmail } = req.body;

  if (
    !serviceBase ||
    !subCategories ||
    !contactNumber ||
    !contactEmail ||
    !Array.isArray(contactNumber) ||
    !Array.isArray(contactEmail)
  ) {
    return res.status(400).json("Not in proper format");
  }

  //this will simply delete the full service record and insert the entire new one.  Decided this will be cleaner and less likely to result in errors
  try {
    //delete the junction tables so they can be refreshed before updating service base
    const deleteSubJunctionResult = await db
      .getServiceDB()
      .getSubCategoryDB()
      .deleteJunctionTablesForService(serviceId);
    if (!deleteSubJunctionResult)
      throw Error("Could not successfully delete junction table entries");
    //update our base table
    const updateServiceBaseResult = await db
      .getServiceDB()
      .getBaseTableQueries()
      .updateEntriesByMultiple(serviceBase, serviceId, "id");
    if (updateServiceBaseResult instanceof Error)
      throw new Error(updateServiceBaseResult.message);
    //add in our contact numbers
    const formattedNumbers = contactNumber.map((contact) => ({
      ...contact,
      service_id: serviceId,
    }));
    await db
      .getServiceDB()
      .getContactNumberDB()
      .deletePhoneContactsByService("service_id", serviceId);
    await db
      .getServiceDB()
      .getContactNumberDB()
      .insertPhoneContacts(formattedNumbers);
    //add in email contacts
    const formattedEmails = contactEmail.map((contact) => ({
      ...contact,
      service_id: serviceId,
    }));
    await db
      .getServiceDB()
      .getContactEmailDB()
      .deleteEmailContacts("service_id", serviceId);
    await db
      .getServiceDB()
      .getContactEmailDB()
      .insertMultipleEmails(formattedEmails);

    //now we need to update the base service and not create the full service entry just create the junction tables
    const createResult = await db
      .getServiceDB()
      .getSubCategoryDB()
      .createAllSubCategories(serviceId, subCategories);
    if (!createResult)
      throw Error(
        "Service was deleted in preparation however an error occured when trying to add in updated version"
      );

    res.status(200).json({ id: serviceId, message: "Successfully updated" });
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default updateServiceController;
