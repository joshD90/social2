import crypto from "crypto";
import { sendConfirmMail } from "../../../../utils/AWS/SES/SES";
import { db } from "../../../../server";

const sendStoreConfirmationLink = async (email: string) => {
  const magicKey = crypto.randomBytes(50).toString();

  const insertData = { email, associated_key: magicKey };

  //save to the database
  const insertResult = await db
    .getEmailConfirmationKeysDB()
    .genericEmailConfirmQueries.createTableEntryFromPrimitives(insertData);

  if (insertResult instanceof Error) throw Error(insertResult.message);
  //send off the email
  const emailSendResult = await sendConfirmMail(email, magicKey);

  return emailSendResult;
};

export default sendStoreConfirmationLink;
