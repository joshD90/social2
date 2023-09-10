import { Request, Response } from "express";

import { db } from "../../../../server";
import { IUser } from "../../../../types/userTypes/UserType";

const createServiceReportController = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  if (!req.user || (req.user as IUser).email === "guest@guest.com")
    return res.status(401).json("You must be signed in to generate a report");
  console.log(req.body);
  if (!req.body.data || !req.body.user || !req.body.serviceId)
    return res.status(400).json("Missing Some Key Information");
  const { data, user, serviceId } = req.body;
  if (!(typeof data.inaccuracyDesc === "string") || !user.id)
    return res.status(400).json("Missing some user id or issue description");
  try {
    const createdEntry = await db.getServiceReportDB().createEntry({
      userId: user.id,
      report: data.inaccuracyDesc,
      serviceId: serviceId,
    });
    if (createdEntry instanceof Error)
      throw new Error("There was an issue in creating this entry");
    console.log(createdEntry, "CREATED ENTRY");
    return res
      .status(201)
      .json(
        `You have successfully submitted a report with id of ${createdEntry.insertId}`
      );
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};

export default createServiceReportController;
