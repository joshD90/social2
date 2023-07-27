export interface IUser {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  privileges: TUserPrivileges;
  password?: string;
  organisation: string;
  comments?: number[];
}

export type TUserPrivileges = "none" | "approved" | "moderator" | "admin";

export type UserSearchTuple = ["id" | "email", number | string];

export type TIterableStringObj = { [key: string]: string };
