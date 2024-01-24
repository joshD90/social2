import { Dispatch } from "react";
import { IUser } from "./UserTypes";

export type AuthStateTypes = {
  isLoading: boolean;
  user: IUser | null;
  error: string | null;
};

export type UserContextType = {
  currentUser: AuthStateTypes;
  userDispatch: Dispatch<AuthReducerActions> | (() => void);
};

export type AuthReducerActions =
  | {
      type: "GET_USER_INIT";
    }
  | {
      type: "GET_USER_SUCCESS";
      payload: any;
    }
  | {
      type: "GET_USER_FAILURE";
      payload: string;
    };

export type TPasswordResetToken = {
  id?: number;
  username: string;
  reset_token: string;
};
