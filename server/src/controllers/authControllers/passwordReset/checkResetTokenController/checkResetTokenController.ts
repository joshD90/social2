import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { db } from "../../../../server";
import { TPasswordResetToken } from "../../../../types/userTypes/UserType";

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
    const userResult = await db
      .getPasswordResetTokensDB()
      .getGenericQueries()
      .findEntryBy<TPasswordResetToken>("username", email);

    if (userResult.length === 0) return res.status(401).json();
    const areTheSame = await bcrypt.compare(token, userResult[0].reset_token);
    if (!areTheSame)
      return res
        .status(401)
        .json("You are not authorised to reset your password");
    const newHashedPW = await bcrypt.hash(newPassword, 10);
    const updateResult = await db
      .getPasswordResetTokensDB()
      .getGenericQueries()
      .updateEntriesByMultiple(
        { password: newHashedPW },
        "email",
        email,
        currentConnection
      );

    if (updateResult.affectedRows === 0) {
      currentConnection.rollback();
      return res
        .status(404)
        .json("Could not find the user you are referring to");
    }

    await currentConnection.commit();
    res.status(200).json("successfully updated password!");
  } catch (error) {
    await currentConnection.rollback();
    return res.status(500).json(error);
  } finally {
    currentConnection.release();
  }
};
