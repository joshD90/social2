import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { db } from "../../../../server";
import { sendResetPasswordEmail } from "../../../../utils/AWS/SES/SES_v3";

export const createTokenSendLinkController = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  if (!email)
    return res
      .status(400)
      .json("Need to know which username to attempt to reset");

  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();

    await db
      .getPasswordResetTokensDB()
      .getGenericQueries()
      .deleteBySingleCriteria("username", email, currentConnection);

    const token = crypto.randomBytes(50).toString("hex");

    const hashedToken = await bcrypt.hash(token, 10);

    const tokenInsertResult = await db
      .getPasswordResetTokensDB()
      .getGenericQueries()
      .createTableEntryFromPrimitives(
        { username: email, reset_token: hashedToken },
        currentConnection
      );
    if (tokenInsertResult.affectedRows === 0) throw Error("No Affected Rows");

    await sendResetPasswordEmail(email, token);
    await currentConnection.commit();

    return res.status(200).json("Email Successfully Sent");
  } catch (error) {
    currentConnection.rollback();
    return res.status(500).json(error);
  } finally {
    currentConnection.release();
  }
};
