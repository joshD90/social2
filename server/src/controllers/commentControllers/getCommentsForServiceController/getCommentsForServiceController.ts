import { Request, Response } from "express";
import { db } from "../../../server";

export const getCommentsForServiceController = async (
  req: Request,
  res: Response
) => {
  if (
    !req.query ||
    !req.query.serviceId ||
    typeof req.query.serviceId !== "string"
  )
    return res
      .status(400)
      .json("Request body is not appropriate for fetching comments");

  const serviceId = parseInt(req.query.serviceId);
  if (typeof serviceId !== "number")
    return res.status(400).json("serviceId must be of type number");
  const result = await db.getCommentsDB().fetchComments(serviceId, 10, 0);
  if (result instanceof Error) res.status(500).json(result.message);
  res.status(200).json(result);
};
