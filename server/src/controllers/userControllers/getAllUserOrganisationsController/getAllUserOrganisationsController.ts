import { Request, Response } from "express";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";
export const getAllUserOrganisationsController = async (
  req: Request,
  res: Response
) => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(403)
      .json("You do not have the privileges to access this endpoint");
  try {
    const organisationNames = await db.getUserDB().getAllOrganisations();
    return res.status(200).json(organisationNames);
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};
