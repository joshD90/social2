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

export type TUserPrivileges = "none" | "approved" | "moderator" | "admin";

export type UserSearchTuple = [
  "users.id" | "email" | "organisation",
  number | string
];

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export type TIterableStringObj = { [key: string]: string };
