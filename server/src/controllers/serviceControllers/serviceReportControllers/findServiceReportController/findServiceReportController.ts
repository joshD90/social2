import { Request, Response } from "express";
import { db } from "../../../../server";

const findServiceReportController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const strId = req.params.id;
  const id = parseInt(strId);
  if (isNaN(id))
    return res.status(400).json("Id must be convertible to number");

  try {
    const entry = await db.getServiceReportDB().getSingleServiceReportEntry(id);
    if (entry instanceof Error) throw Error(entry.message);
    return res.status(200).json(entry);
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};

export default findServiceReportController;
