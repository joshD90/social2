import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "../../types/userTypes/UserType";
import { db } from "../../server";
import sendStoreConfirmationLink from "./emailConfirm/sendStoreConfirmationLink/sendStoreConfirmationLink";
import { connectionMock } from "../../db/generalQueryGenerator/GeneralQueryGenerator.test";

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

  if (!checkDomainCorrect(email, organisation))
    return res
      .status(400)
      .json(
        "The organisation does not match your email, please use your work email as an identifier"
      );
  const currentConnection = await db.getSinglePoolConnection();
  try {
    await currentConnection.beginTransaction();

    const hashedPW = await bcrypt.hash(password, 10);

    const user: IUser = {
      email,
      firstName,
      lastName,
      password: hashedPW,
      organisation,
      privileges: "none",
    };

    const result = await db.getUserDB().createNewUser(user, currentConnection);

    const emailConfirmationKeyResult = await sendStoreConfirmationLink(
      user.email,
      currentConnection
    );
    await currentConnection.commit();
    res
      .status(201)
      .json(`New user was created with the id of ${result.insertId}`);
  } catch (error) {
    await currentConnection.rollback();
    if (error instanceof Error)
      return res
        .status(500)
        .json(error.message + "There was an error in creating the user");
    res.status(500).json(error);
  } finally {
    currentConnection.release();
  }
};

const checkDomainCorrect = (email: string, organisation: string) => {
  if (!email.includes(organisation)) return false;
  const indexofAt = email.indexOf("@");

  const afterAt = email.slice(indexofAt + 1).toLowerCase();
  const domain = afterAt.slice(0, afterAt.indexOf("."));

  if (domain !== organisation.toLowerCase()) return false;

  return true;
};

export default authSignupController;
