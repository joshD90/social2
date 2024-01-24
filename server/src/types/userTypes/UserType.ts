import { Request } from "express";

export interface IUser {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  privileges: TUserPrivileges;
  password?: string;
  organisation: string | number;
  comments?: number[];
}

export type TUserPrivileges =
  | "none"
  | "emailConfirmed"
  | "approved"
  | "moderator"
  | "admin";

export type UserSearchTuple = [
  "users.id" | "email" | "organisation",
  number | string
];

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export type TIterableStringObj = { [key: string]: string };

export interface IEmailConfirmationKey {
  id?: number;
  email: string;
  associated_key: string;
  creation_time: string;
  expiry_time: string;
}

export type TPasswordResetToken = {
  id?: number;
  username: string;
  reset_token: string;
};
