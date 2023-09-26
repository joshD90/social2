import { Request, Response } from "express";
import { db } from "../../../../server";
import { IUser } from "../../../../types/userTypes/UserType";

const updateServiceReportStatusController = async (
  req: Request,
  res: Response
) => {
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(403)
      .json("You do not have sufficient privileges to update this resource");
  const reportId = req.body.reportId;
  const status = req.body.reportStatus;
  if (!reportId || !status)
    return res
      .status(400)
      .json("Does not have the correct information in body");
  try {
    const updateResult = await db
      .getServiceReportDB()
      .updateSingleReportStatus(reportId, status);
    if (updateResult instanceof Error) throw updateResult;
    res.status(200).json("Report status successfully updated");
  } catch (error) {
    if (!(error instanceof Error)) return console.log(error);
    if (error.message === "Status value not in correct range")
      return res.status(400).json(error.message);
    res.status(500).json(error.message);
  }
};

export default updateServiceReportStatusController;
