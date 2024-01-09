import { Request, Response } from "express";
import checkEmailConfirmKey from "../checkEmailConfirmKey/checkEmailConfirmKey";
import { db } from "../../../../server";

const checkEmailKeyController = async (req: Request, res: Response) => {
  const { username, magickey } = req.query;
  if (
    !username ||
    !magickey ||
    typeof username !== "string" ||
    typeof magickey !== "string"
  )
    return res
      .status(400)
      .json("Need to have a valid username and key as part of the link");

  try {
    if (!checkEmailConfirmKey(username, magickey))
      return res.status(403).json("No Matching elements ");
    //if successful we don't need this so clear it from our table
    db.getEmailConfirmationKeysDB().genericEmailConfirmQueries.deleteByTwoCriteria(
      ["email", "associated_key"],
      [username, magickey]
    );
    //TODO: We need to update the status of the user to be email authorised
    const updatePrivilegeResult = await db
      .getUserDB()
      .getGenericUserQueries()
      .updateEntriesByMultiple(
        { privileges: "emailConfirmed" },
        username,
        "email"
      );
    if (updatePrivilegeResult instanceof Error)
      throw Error(updatePrivilegeResult.message);
    return res.status(200).json("Authenticated");
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default checkEmailKeyController;
