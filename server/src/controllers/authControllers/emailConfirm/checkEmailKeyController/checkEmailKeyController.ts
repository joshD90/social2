import { Request, Response } from "express";
import checkEmailConfirmKey from "../checkEmailConfirmKey/checkEmailConfirmKey";

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
  } catch (error) {}
};

export default checkEmailKeyController;
