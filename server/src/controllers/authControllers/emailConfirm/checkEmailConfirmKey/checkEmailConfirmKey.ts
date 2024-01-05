import { db } from "../../../../server";

const checkEmailConfirmKey = async (email: string, key: string) => {
  const result = await db
    .getEmailConfirmationKeysDB()
    .findEmailKeyPair(email, key);
  if (result.length === 0) return false;

  //check expiry
  const creationDate = new Date(result[0].creation_time);
  const currentTime = Date.now();

  const timeDiff = currentTime - creationDate.getTime();

  const oneDay = 24 * 60 * 60 * 1000;
  if (timeDiff > oneDay) return false;

  return true;
};

export default checkEmailConfirmKey;
