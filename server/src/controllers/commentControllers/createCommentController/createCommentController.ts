import { Request, Response } from "express";
import { ICommentBase } from "../../../types/commentTypes/commentTypes";
import { db } from "../../../server";
import { IUser } from "../../../types/userTypes/UserType";

export const createCommentController = async (req: Request, res: Response) => {
  if (!req.user || !req.user.hasOwnProperty("id"))
    return res.status(403).json("Need to be Logged In");

  if ((req.user as unknown as IUser).privileges === "none")
    return res
      .status(403)
      .json("You do not have sufficient rights to access this");

  const preparedObject = convertToSQLReady(req.body);
  if (!preparedObject)
    return res.status(400).json("Data sent over is incorrect");

  if ((req.user as IUser).id !== preparedObject.user_id)
    return res.status(403).json("You can only write comments in your own name");

  const result = await db.getCommentsDB().createNewComment(preparedObject);
  if (result instanceof Error)
    return res.status(500).json("There was a problem in creating your comment");
  return res.status(201).json({ newId: result });
};

const convertToSQLReady = (reqBody: unknown): ICommentBase | false => {
  const preparedObject: Partial<ICommentBase> = {};
  if (!reqBody) return false;
  if (!(reqBody instanceof Object)) return false;
  if (
    !reqBody.hasOwnProperty("user_id") ||
    !reqBody.hasOwnProperty("comment") ||
    !reqBody.hasOwnProperty("service_id")
  )
    return false;
  if (typeof (reqBody as ICommentBase).user_id !== "number") return false;
  if (typeof (reqBody as ICommentBase).service_id !== "number") return false;
  if (typeof (reqBody as ICommentBase).comment !== "string") return false;

  preparedObject.user_id = (reqBody as ICommentBase).user_id;
  preparedObject.service_id = (reqBody as ICommentBase).service_id;
  preparedObject.comment = (reqBody as ICommentBase).comment;

  if (
    reqBody.hasOwnProperty("inReplyTo") &&
    typeof (reqBody as ICommentBase).inReplyTo === "number"
  )
    preparedObject.inReplyTo = (reqBody as ICommentBase).inReplyTo;
  return preparedObject as ICommentBase;
};
