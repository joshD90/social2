import { Request, Response } from "express";
import { IUser } from "../../../types/userTypes/UserType";
import { db } from "../../../server";

const updateUserPrivilegesController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (
    !req.user ||
    ((req.user as IUser).privileges !== "moderator" &&
      (req.user as IUser).privileges !== "admin")
  )
    return res
      .status(403)
      .json(
        "You do not have the privileges to be adjusting other users privileges"
      );

  const { userToUpdateId, newPrivilege } = req.body;

  if (
    typeof parseInt(userToUpdateId) !== "number" ||
    typeof newPrivilege !== "string"
  )
    return res.status(400).json("Your req body is no in right format");
  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();
    //check is the user within the same organisation if being accessed by moderator
    const userToChange = await db
      .getUserDB()
      .findUser(["users.id", userToUpdateId]);

    if (
      (req.user as IUser).privileges !== "admin" &&
      userToChange[0]?.organisation !== (req.user as IUser).organisation
    )
      return res
        .status(403)
        .json("You can only change the status within your own organisation");

    await db
      .getUserDB()
      .updatePrivileges(
        newPrivilege,
        parseInt(userToUpdateId),
        currentConnection
      );
    await currentConnection.commit();
  } catch (error) {
    currentConnection.rollback();
    return res.status(500).json((error as Error).message);
  } finally {
    currentConnection.release();
  }

  return res.status(200).json("Updated Successfully");
};

export default updateUserPrivilegesController;
