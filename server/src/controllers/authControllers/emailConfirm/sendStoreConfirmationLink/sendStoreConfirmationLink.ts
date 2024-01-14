import crypto from "crypto";
import { sendConfirmMail } from "../../../../utils/AWS/SES/SES";
import { db } from "../../../../server";
import { PoolConnection } from "mysql2/promise";

const sendStoreConfirmationLink = async (
  email: string,
  currentConnection: PoolConnection
) => {
  const magicKey = crypto.randomBytes(50).toString("hex");

  const insertData = { email, associated_key: magicKey };

  //save to the database
  const insertResult = await db
    .getEmailConfirmationKeysDB()
    .genericEmailConfirmQueries.createTableEntryFromPrimitives(
      insertData,
      currentConnection
    );

  //send off the email
  const emailSendResult = await sendConfirmMail(email, magicKey);

  return emailSendResult;
};

export default sendStoreConfirmationLink;
