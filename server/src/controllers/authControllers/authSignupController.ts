import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "../../types/userTypes/UserType";
import { db } from "../../server";

const authSignupController = async (req: Request, res: Response) => {
  const {
    email,
    firstName,
    lastName,
    password,
    organisation,
    passwordConfirm,
  } = req.body;

  if (
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    !passwordConfirm ||
    !organisation
  )
    return res.status(400).json("Missing some key information");

  if (password !== passwordConfirm)
    return res.status(400).json("Passwords dont match");

  try {
    const hashedPW = await bcrypt.hash(password, 10);

    const user: IUser = {
      email,
      firstName,
      lastName,
      password: hashedPW,
      organisation,
      privileges: "none",
    };

    const result = await db.getUserDB().createNewUser(user);
    if (result instanceof Error) throw Error("Issue with creating the entry");
    res
      .status(201)
      .json(`New user was created with the id of ${result.insertId}`);
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json("There was an error in creating the user");
    res.status(500).json(error);
  }
};

export default authSignupController;
