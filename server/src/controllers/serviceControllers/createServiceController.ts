import { Request, Response } from "express";

import { db } from "../../server";
import { IUser } from "../../types/userTypes/UserType";

const createServiceController = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(401)
      .json("You are not Authorised to Create a Service. Must be an admin");

  //set up
  const serviceDB = db.getServiceDB();
  const serviceBase = req.body.serviceBase;
  const subCatergories = req.body.subCategories;
  const contactNumbers = req.body.contactNumber ?? [];
  console.log(serviceBase, subCatergories, contactNumbers);
  console.log(contactNumbers, "contact numbers specifically");
  //create database entry
  const result = await serviceDB.createFullServiceEntry(
    serviceBase,
    contactNumbers,
    subCatergories
  );
  if (result instanceof Error)
    return res
      .status(500)
      .send(`Could not create the service due to ${result.message}`);

  res.status(201).json({
    id: result.insertId,
    message: `Service created with base service having an id of ${result.insertId}`,
  });
};

export default createServiceController;
