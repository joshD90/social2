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

  //check is the user within the same organisation if being accessed by moderator
  const userToChange = await db
    .getUserDB()
    .findUser(["users.id", userToUpdateId]);

  if (userToChange instanceof Error)
    return res.status(500).json(userToChange.message);
  if (
    (req.user as IUser).privileges !== "admin" &&
    userToChange[0]?.organisation !== (req.user as IUser).organisation
  )
    return res
      .status(403)
      .json("You can only change the status within your own organisation");

  const result = await db
    .getUserDB()
    .updatePrivileges(newPrivilege, parseInt(userToUpdateId));

  if (result instanceof Error) return res.status(500).json(result.message);

  return res.status(200).json("Updated Successfully");
};

export default updateUserPrivilegesController;
