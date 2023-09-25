import React, { FC, createContext, useEffect, useReducer } from "react";
import { UserContextType } from "../../types/userTypes/AuthTypes";
import userReducer from "../../reducers/userReducer/userReducer";
import envIndex from "../../envIndex/envIndex";

type Props = { children?: React.ReactNode };

//because we must export the AuthContext external to the Provider wrapper we need to be able to pass an empty function to the authContext initialiser however this empty function will never be used in child components it will only be consuming the setState function
export const AuthContext = createContext<UserContextType>({
  currentUser: { isLoading: true, user: null, error: null },
  userDispatch: () => {
    null;
  },
});

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [currentUser, userDispatch] = useReducer(userReducer, {
    isLoading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    const url = `${envIndex.urls.baseUrl}/auth/user-data`;
    const abortController = new AbortController();
    //when we initially load we check whether our saved token is valid so we dont lose user info everytime that we refresh
    (async () => {
      try {
        userDispatch({ type: "GET_USER_INIT" });
        const result = await fetch(url, {
          credentials: "include",
          signal: abortController.signal,
        });
        if (!result.ok) throw Error(result.statusText);
        const user = await result.json();

        return userDispatch({ type: "GET_USER_SUCCESS", payload: user });
      } catch (error) {
        if (error instanceof Error)
          return userDispatch({
            type: "GET_USER_FAILURE",
            payload: error.message,
          });
        return userDispatch({
          type: "GET_USER_FAILURE",
          payload: "Unknown Error Occurred",
        });
      }
    })();
    return () => abortController.abort();
  }, []);

  if (currentUser.isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-800 text-slate-50">
        ...Loading
      </div>
    );

  return (
    <AuthContext.Provider value={{ currentUser, userDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
