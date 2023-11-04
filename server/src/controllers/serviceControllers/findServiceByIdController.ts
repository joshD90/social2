import { Request, Response } from "express";

import { db } from "../../server";

export const findServiceByIdController = async (
  req: Request,
  res: Response
) => {
  const serviceId = parseInt(req.params.serviceId);
  if (!serviceId) return res.status(400).json("Needs a serviceId");
  try {
    const serviceResult = await db
      .getServiceDB()
      .fetchServiceAndRelatedEntries(serviceId);
    if (!serviceResult)
      return res.status(404).json("Could not find relevant entry");
    console.log(serviceResult, "serviceResult");
    if (serviceResult instanceof Error) throw new Error(serviceResult.message);

    res.status(200).json(serviceResult);
  } catch (error) {
    res.status(500).json(error);
  }
};
