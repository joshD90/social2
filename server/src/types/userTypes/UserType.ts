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
  "id" | "email" | "organisation",
  number | string
];

export type TIterableStringObj = { [key: string]: string };
