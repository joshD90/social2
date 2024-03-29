import { Request, Response } from "express";
import { IVote } from "../../../types/commentTypes/commentTypes";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";

export const commentVoteController = async (req: Request, res: Response) => {
  if (
    !req.user ||
    (req.user as unknown as IUser).privileges === "none" ||
    (req.user as unknown as IUser).privileges === "emailConfirmed"
  )
    return res.status(401).json("Need to be logged in to vote");
  const voteToPass = validateVote(req.body);
  if (!voteToPass)
    return res.status(400).json("Request body is not in right format");
  const currentConnection = await db.getSinglePoolConnection();

  try {
    await currentConnection.beginTransaction();
    const result = await db
      .getCommentsDB()
      .voteComment(voteToPass, currentConnection);
    await currentConnection.commit();

    return res.status(200).json("Vote Successfully recorded");
  } catch (error) {
    console.log(error);
    await currentConnection.rollback();

    return res.status(500).json((error as Error).message);
  } finally {
    currentConnection.release();
  }
};

const validateVote = (reqBody: unknown): IVote | false => {
  if (!(reqBody instanceof Object)) return false;
  if (
    !reqBody.hasOwnProperty("commentId") ||
    !reqBody.hasOwnProperty("userId") ||
    !reqBody.hasOwnProperty("voteValue")
  )
    return false;
  const partialValidate = reqBody as IVote;
  if (
    typeof partialValidate.commentId === "number" &&
    typeof partialValidate.userId === "number" &&
    typeof partialValidate.voteValue === "number"
  )
    return {
      commentId: partialValidate.commentId,
      userId: partialValidate.userId,
      voteValue: partialValidate.voteValue,
    };
  return false;
};
