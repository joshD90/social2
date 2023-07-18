import { Request, Response } from "express";

import { db } from "../../server";

const createServiceController = async (req: Request, res: Response) => {
  //set up
  const serviceDB = db.getServiceDB();
  const serviceBase = req.body.serviceBase;
  const subCatergories = req.body.subCategories;
  //create database entry
  const result = await serviceDB.createFullServiceEntry(
    serviceBase,
    subCatergories
  );
  if (result instanceof Error)
    return res
      .status(500)
      .send(`Could not create the service due to ${result.message}`);

  res
    .status(201)
    .json(
      `Service created with base service having an id of ${result.insertId}`
    );
};

export default createServiceController;
