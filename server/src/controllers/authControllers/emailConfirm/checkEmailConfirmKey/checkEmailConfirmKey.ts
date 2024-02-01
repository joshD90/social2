import { db } from "../../../../server";
import { checkIf24HoursOld } from "../../../../utils/checkIf24HoursOld";

const checkEmailConfirmKey = async (
  email: string,
  key: string
): Promise<boolean> => {
  const result = await db
    .getEmailConfirmationKeysDB()
    .findEmailKeyPair(email, key);
  if (result.length === 0) return false;

  try {
    return checkIf24HoursOld(result[0].creation_time);
  } catch (error) {
    return false;
  }
};

export default checkEmailConfirmKey;
