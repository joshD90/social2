import { Request, Response } from "express";

import { db } from "../../server";
import { IUser } from "../../types/userTypes/UserType";

export const findServiceByIdController = async (
  req: Request,
  res: Response
) => {
  const serviceId = parseInt(req.params.serviceId);

  if (!serviceId) return res.status(400).json("Needs a serviceId");
  try {
    const serviceResult = await db
      .getServiceDB()
      .fetchServiceAndRelatedEntries(serviceId, req.user as IUser | null);

    if (!serviceResult)
      return res.status(404).json("Could not find relevant entry");

    if (serviceResult instanceof Error) throw new Error(serviceResult.message);

    res.status(200).json(serviceResult);
  } catch (error) {
    console.log(error, "error in service by id controller");
    res.status(500).json(error);
  }
};
