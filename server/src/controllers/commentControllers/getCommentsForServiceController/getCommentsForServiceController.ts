import { Request, Response } from "express";
import { db } from "../../../server";
import { IUser } from "../../../types/userTypes/UserType";

export const getCommentsForServiceController = async (
  req: Request,
  res: Response
) => {
  if (!req.user || (req.user as unknown as IUser).privileges === "none")
    return res
      .status(403)
      .json("You do not have sufficient rights to access this");
  if (
    !req.query ||
    !req.query.serviceId ||
    typeof req.query.serviceId !== "string"
  )
    return res
      .status(400)
      .json("Request body is not appropriate for fetching comments");

  let organisation = "";
  const { queryorg } = req.query;

  organisation = (req.user as IUser).organisation?.toString();
  if ((req.user as IUser).organisation === "admin" && queryorg)
    organisation = queryorg?.toString() || "admin";
  const serviceId = parseInt(req.query.serviceId);
  if (typeof serviceId !== "number")
    return res.status(400).json("serviceId must be of type number");
  const queryOffset = parseInt(req.query.offset as string);

  const paramsToPass: {
    organisation: string;
    serviceId: number;
    limit: number;
    offset: number;
    parentId?: number;
  } = {
    organisation,
    serviceId,

    limit: 5,
    offset: queryOffset ? queryOffset : 0,
  };
  if (
    req.query.parentCommentId &&
    typeof req.query.parentCommentId === "string" &&
    typeof parseInt(req.query.parentCommentId) === "number"
  )
    paramsToPass.parentId = parseInt(req.query.parentCommentId);

  const result = await db.getCommentsDB().fetchComments(paramsToPass);
  if (result instanceof Error) return res.status(500).json(result.message);
  res.status(200).json(result);
};
