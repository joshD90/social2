import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";
import { RowDataPacket } from "mysql2";

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
  let result: RowDataPacket[] | Error;

  if (req.query.serviceId) {
    //get all the reports for a particular service if the query param is there
    const serviceId = parseInt(req.query.serviceId as string);
    console.log(serviceId);
    if (isNaN(serviceId))
      return res
        .status(400)
        .json("serviceId query param should be of type int for this table");
    result = await db.getServiceReportDB().getEntriesByService(serviceId);
  } else {
    //get all the reports in the table
    result = await db.getServiceReportDB().getAllServiceReportEntries();
  }

  if (result instanceof Error)
    return res.status(500).json("There was an error searching the database");
  if (result.length === 0) res.status(404).json("No Entries found");
  res.status(200).json(result);
};

export default findAllServiceReportController;
