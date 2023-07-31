import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { IUser } from "../../types/userTypes/UserType";
import envConfig from "../../env/envConfig";

const authSignInController = (req: Request, res: Response): Response => {
  if (!req.user)
    return res
      .status(500)
      .json("There was an issue with verifying your credentials");

  const [user] = req.user as IUser[];

  try {
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
        privileges: user.privileges,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      envConfig.auth.jwtSecret,
      { expiresIn: "1d" }
    );

    console.log(token, "token just after signing");

    return res
      .cookie("jwt", token, { httpOnly: true, secure: false })
      .status(200)
      .json(user);
  } catch (error) {
    return res.status(401).json({ message: "There was an error loggin in" });
  }
};

export default authSignInController;
