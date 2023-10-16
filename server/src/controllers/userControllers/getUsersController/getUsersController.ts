import { Request, Response } from "express";
import { db } from "../../../server";
import { IUser } from "../../../types/userTypes/UserType";

const getUsersController = async (req: Request, res: Response) => {
  if (
    !req.user ||
    ((req.user as IUser).privileges !== "admin" &&
      (req.user as IUser).privileges !== "moderator")
  )
    return res.status(403).json("You do not have sufficient privileges");

  let organisation = req.query.organisation?.toString() || null;
  console.log("hitting this point", organisation, "this is the organisation");
  try {
    if ((req.user as IUser).privileges === "admin" && !organisation) {
      const result = await db.getUserDB().getAllUsers();
      if (result instanceof Error) throw Error(result.message);
      return res.status(200).json(result);
    } else {
      if (!organisation)
        organisation = (req.user as IUser).organisation.toString();
      const result = await db
        .getUserDB()
        .findUser(["organisation", organisation]);
      console.log(result, "result in getUsersController");
      if (result instanceof Error) throw Error(result.message);
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default getUsersController;
