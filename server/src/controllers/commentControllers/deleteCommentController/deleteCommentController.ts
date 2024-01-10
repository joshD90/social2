import { Request, Response } from "express";

import { db } from "../../../server";
import { IUser } from "../../../types/userTypes/UserType";

const deleteCommentController = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user)
    return res.status(401).json("Need to be logged in to perform this action");

  const commentId = parseInt(req.params.commentId);

  if (!commentId || typeof commentId !== "number")
    return res.status(400).json("Needs a commentId to delete the comment");
  const commentToDelete = await db
    .getCommentsDB()
    .getCommentsGeneric()
    .findEntryBy("id", commentId);
  if (!commentToDelete || commentToDelete.length === 0)
    return res.status(404).json("Could not find this comment to delete");
  if (user.privileges === "admin") return handleDeleteHelper(res, commentId);
  if (
    user.privileges === "moderator" &&
    user.organisation === commentToDelete[0]?.organisation
  )
    return handleDeleteHelper(res, commentId);
  if (user.privileges === "approved" && user.id === commentToDelete[0]?.user_id)
    return handleDeleteHelper(res, commentId);

  return res
    .status(403)
    .json("You do not have permission to delete this comment");
};

const handleDeleteHelper = async (
  res: Response,
  commentId: number
): Promise<Response> => {
  try {
    const deleteResult = await db.getCommentsDB().deleteComment(commentId);
    if (deleteResult.affectedRows === 0)
      return res
        .status(404)
        .json("No Comments by that Id were available to delete");
    return res.status(200).json("Deleted Successfully");
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};

export default deleteCommentController;
