import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { db } from "../../../../server";
import { TPasswordResetToken } from "../../../../types/userTypes/UserType";
import { checkIf24HoursOld } from "../../../../utils/checkIf24HoursOld";

export const checkResetTokenController = async (
  req: Request,
  res: Response
) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword || typeof newPassword !== "string")
    return res.status(400).json("Missing Email, Token or Password");
  //bcrypt.compare
  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();

    const actualUser = await db.getUserDB().findUser(["email", email]);

    if (
      actualUser.length === 0 ||
      actualUser[0].privileges === "admin" ||
      actualUser[0].privileges === "moderator"
    )
      return res.status(401).json("You are not authorised to do this");

    const userResult = await db
      .getPasswordResetTokensDB()
      .getGenericQueries()
      .findEntryBy<TPasswordResetToken>("username", email);

    if (userResult.length === 0)
      return res.status(401).json("Email Does not Match Our Records");
    const areTheSame = await bcrypt.compare(token, userResult[0].reset_token);

    if (!areTheSame)
      return res
        .status(401)
        .json("You are not authorised to reset your password");

    if (!checkIf24HoursOld(userResult[0].created_at!))
      return res.status(401).json("The Token has Expired");

    const newHashedPW = await bcrypt.hash(newPassword, 10);
    const updateResult = await db
      .getUserDB()
      .getGenericUserQueries()
      .updateEntriesByMultiple(
        { password: newHashedPW },
        email,
        "email",
        currentConnection
      );

    if (updateResult.affectedRows === 0) {
      currentConnection.rollback();
      return res
        .status(404)
        .json("Could not find the user you are referring to");
    }

    //delete token at very end of process
    await db
      .getPasswordResetTokensDB()
      .getGenericQueries()
      .deleteBySingleCriteria("username", email, currentConnection);

    await currentConnection.commit();
    res.status(200).json("successfully updated password!");
  } catch (error) {
    console.log(error, "error in check reset token controller");
    await currentConnection.rollback();
    return res.status(500).json(error);
  } finally {
    currentConnection.release();
  }
};
