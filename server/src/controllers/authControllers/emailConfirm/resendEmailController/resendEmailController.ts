import crypto from "crypto";

import { Request, Response } from "express";
import { sendConfirmMail } from "../../../../utils/AWS/SES/SES_v3";
import { db } from "../../../../server";

const resendEmailController = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== "string")
    return res
      .status(400)
      .json("needs an associated email in the form of a string");
  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();
    //check if there is a user matching this record first
    const userResult = await db.getUserDB().findUser(["email", email]);

    if (userResult.length === 0)
      return res
        .status(404)
        .json(
          "Cant find user associated with this email address.  Try signing up"
        );
    //overwrite all previous entries
    await db
      .getEmailConfirmationKeysDB()
      .genericEmailConfirmQueries.deleteBySingleCriteria(
        "email",
        email,
        currentConnection
      );

    const newKey = crypto.randomBytes(50).toString("hex");
    const sendResult = await sendConfirmMail(
      email as unknown as string,
      newKey
    );
    await currentConnection.commit();
    //do we need to send anything back here
    return res.status(200).json(sendResult);
  } catch (error) {
    console.log(error);
    await currentConnection.rollback();
    res
      .status(500)
      .json(
        "There was an error in processing this request" +
          (error as Error).message
      );
  } finally {
    currentConnection.release();
  }
};

export default resendEmailController;
