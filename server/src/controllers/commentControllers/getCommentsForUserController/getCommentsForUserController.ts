import { Request, Response } from "express";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";

const getCommentsForUserController = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(401)
      .json("You are not authorised to access this endpoint");
  const user = req.user as IUser;

  const userId = parseInt(req.params.userId);
  if (!userId || isNaN(userId))
    res.status(400).json("You need a user Id in Query");
  if (userId !== user.id && user.privileges !== "admin")
    res.status(401).json("You are not authorised to access this endpoint");

  try {
    const commentResponse = await db
      .getCommentsDB()
      .getCommentsGeneric()
      .findEntryBy<IUser>("user_id", userId);
    res.status(200).json(commentResponse);
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default getCommentsForUserController;
