import crypto from "crypto";

import { Request, Response } from "express";
import { sendConfirmMail } from "../../../../utils/AWS/SES/SES";
import { db } from "../../../../server";

const resendEmailController = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email === "string")
    return res
      .status(400)
      .json("needs an associated email in the form of a string");

  try {
    //overwrite all prevoius entries
    const deleteResult = await db
      .getEmailConfirmationKeysDB()
      .genericEmailConfirmQueries.deleteBySingleCriteria(
        "email",
        email as unknown as string
      );
    if (deleteResult instanceof Error) throw Error(deleteResult.message);

    const newKey = crypto.randomBytes(50).toString();
    const sendResult = await sendConfirmMail(
      email as unknown as string,
      newKey
    );
    return res.status(200).json("Successfully sent email");
  } catch (error) {
    res.status(500).json("There was an error in processing this request");
  }
};

export default resendEmailController;
