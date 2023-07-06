import { Request, Response } from "express";

import { db } from "../../server";

const createServiceController = async (req: Request, res: Response) => {
  //set up
  const serviceDB = db.getServiceDB();
  const base = req.body.serviceBase;
  const subCatergories = req.body.serviceSubCategories;

  const result = await serviceDB.createFullServiceEntry(base, subCatergories);
  if (result instanceof Error)
    return res
      .status(500)
      .send(`Could not create the service due to ${result.message}`);
  res
    .status(201)
    .send(
      `Service created with base service having an id of ${result.insertId}`
    );
};

export default createServiceController;
