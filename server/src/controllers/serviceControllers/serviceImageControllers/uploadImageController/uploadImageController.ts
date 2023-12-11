import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";

export const uploadImageController = (req: Request, res: Response) => {
  console.log("hit this endpoint");
  console.log(req.user, "req.user");
  if (!req.user || (req.user as IUser).privileges !== "admin")
    return res
      .status(401)
      .json("You are not authorised to access this endpoint");

  if (!req.files || !Array.isArray(req.files))
    return res
      .status(500)
      .json("No Files Uploaded there was an issue with multer");

  console.log(req.files, "req.files in uploadImageController");
};
