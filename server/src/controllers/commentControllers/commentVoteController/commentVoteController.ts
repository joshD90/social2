import { Request, Response } from "express";
import { IVote } from "../../../types/commentTypes/commentTypes";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";

export const commentVoteController = async (req: Request, res: Response) => {
  if (!req.user || (req.user as unknown as IUser).privileges === "none")
    return res.status(401).json("Need to be logged in to vote");
  const voteToPass = validateVote(req.body);
  if (!voteToPass)
    return res.status(400).json("Request body is not in right format");
  try {
    const result = await db.getCommentsDB().voteComment(voteToPass);
    if (result instanceof Error) throw Error(result.message);
    return res.status(200).json("Vote Successfully recorded");
  } catch (error) {
    console.log(error);
    return res.status(500).json((error as Error).message);
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
