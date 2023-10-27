import { Request, Response } from "express";

import { db } from "../../server";

const deleteCommentController = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(401).json("Need to be logged in to perform this action");

  const commentId = req.body.commentId;
  if (!commentId)
    return res.status(400).json("Needs a commentId to delete the comment");
  const commentToDelete = await db
    .getCommentsDB()
    .getCommentsGeneric()
    .findEntryBy("id", commentId);
  if (!commentToDelete || commentToDelete instanceof Error)
    return res.status(404).json("Could not find this comment to delete");
  if (req.user.privileges === "admin")
    return handleDeleteHelper(res, commentId);
  if (
    req.user.privileges === "moderator" &&
    req.user.organisation === commentToDelete[0]?.organisation
  )
    return handleDeleteHelper(res, commentId);
  if (
    req.user.privileges === "approved" &&
    req.user.id === commentToDelete[0]?.user_id
  )
    return handleDeleteHelper(res, commentId);

  return res
    .status(403)
    .json("You do not have permission to delete this comment");
};

const handleDeleteHelper = async (
  res: Response,
  commentId: number
): Promise<Response> => {
  const deleteResult = await db.getCommentsDB().deleteComment(commentId);
  if (deleteResult instanceof Error)
    return res.status(500).json(deleteResult.message);
  return res.status(200).json("Deleted Successfully");
};

export default deleteCommentController;
