import { Request, Response } from "express";

import { db } from "../../server";
import { IUser } from "../../types/userTypes/UserType";

const deleteServiceByIdController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(401)
      .json("You are not Authorised to Delete a Service. Must be an admin");

  const serviceId = parseInt(req.params.serviceId);
  if (Number.isNaN(serviceId))
    return res.status(400).json("Service Id Provided is not a number");

  try {
    const result = await db
      .getServiceDB()
      .deleteServiceAndRelatedEntries(serviceId);
    if (result) return res.status(204).json("deleted");
    throw Error("There was an error in deleting this record");
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
    return res.status(500).json({ error: error });
  }
};
export default deleteServiceByIdController;
