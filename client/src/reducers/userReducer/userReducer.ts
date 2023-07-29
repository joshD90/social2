import {
  AuthReducerActions,
  AuthStateTypes,
} from "../../types/userTypes/AuthTypes";

const userReducer = (state: AuthStateTypes, action: AuthReducerActions) => {
  switch (action.type) {
    case "GET_USER_INIT":
      return { ...state, isLoading: true, error: null };
    case "GET_USER_SUCCESS":
      return { ...state, isLoading: false, user: action.payload };
    case "GET_USER_FAILURE":
      return { ...state, isLoading: false, user: null, error: action.payload };
  }
};

export default userReducer;
