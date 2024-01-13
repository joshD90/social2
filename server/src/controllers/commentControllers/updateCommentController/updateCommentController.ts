import { Request, Response } from "express";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";

const updateCommentController = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const comment = req.body;

  if (!comment.comment) return res.status(400).json("Needs a comment");
  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();
    await db.getCommentsDB().updateComment(comment, user, currentConnection);
    await currentConnection.commit();
    return res.status(200).json({ newId: comment.id });
  } catch (error) {
    await currentConnection.rollback();
    console.log(error, "error in updateComment Controller");
    return res.status(500).json((error as Error).message);
  } finally {
    currentConnection.release();
  }
};

export default updateCommentController;
