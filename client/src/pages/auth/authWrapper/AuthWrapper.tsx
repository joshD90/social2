import { Outlet, useNavigate } from "react-router-dom";

import "../../../assets/themeColors/backgroundGradients.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import envIndex from "../../../envIndex/envIndex";

const AuthWrapper = () => {
  const { userDispatch } = useContext(AuthContext);
  const [guestError, setGuestError] = useState("");
  const navigate = useNavigate();

  const loginAsGuest = async () => {
    const url = `${envIndex.urls.baseUrl}/auth/signin`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: "guest@guest.com",
          password: "1GuestPassword!",
        }),
      });
      if (!response.ok) throw Error(response.statusText);
      const data = await response.json();
      userDispatch({ type: "GET_USER_SUCCESS", payload: data });
      navigate("/services");
    } catch (error) {
      if (error instanceof Error) {
        setGuestError(
          error.message + ": There was a problem logging in as guest"
        );
        setTimeout(() => setGuestError(""), 3000);
      }
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen backgroundAllColorDark p-10">
      {guestError !== "" && <p className="text-red-400">{guestError}</p>}
      <Outlet />
      <div className="w-2/3 mt-5 flex justify-center items-center flex-col">
        <button
          className="w-48 bg-stone-600 p-2 rounded-sm hover:bg-green-600"
          onClick={loginAsGuest}
        >
          Continue as Guest
        </button>
        <p className="text-stone-400 mt-3">
          Try the site without user features enabled
        </p>
      </div>
    </div>
  );
};

export default AuthWrapper;
