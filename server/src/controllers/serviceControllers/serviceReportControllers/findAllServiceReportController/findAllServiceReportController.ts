import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";

const findAllServiceReportController = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  if (
    !req.user ||
    !(req.user as IUser).privileges ||
    (req.user as IUser).privileges !== "admin"
  )
    return res
      .status(403)
      .json("You do not have sufficient privileges to access this endpoint");
  const result = await db.getServiceReportDB().getAllServiceReportEntries();
  if (result instanceof Error)
    return res.status(500).json("There was an error searching the database");
  if (result.length === 0) res.status(404).json("No Entries found");
  res.status(200).json(result);
};

export default findAllServiceReportController;
