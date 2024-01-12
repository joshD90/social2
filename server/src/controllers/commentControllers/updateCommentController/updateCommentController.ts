import { Request, Response } from "express";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";

const updateCommentController = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const comment = req.body;

  if (!comment.comment) return res.status(400).json("Needs a comment");
  const currentConnection = await db.getSinglePoolConnection();
  try {
    currentConnection.beginTransaction();
    await db.getCommentsDB().updateComment(comment, user, currentConnection);
    currentConnection.commit();
    currentConnection.release();

    return res.status(200).json({ newId: comment.id });
  } catch (error) {
    currentConnection.rollback();
    currentConnection.release();
    console.log(error, "error in updateComment Controller");
    return res.status(500).json((error as Error).message);
  }
};

export default updateCommentController;
