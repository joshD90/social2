import { Outlet } from "react-router-dom";

import "../../../assets/themeColors/backgroundGradients.css";

const AuthWrapper = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen backgroundAllColorDark">
      <Outlet />
      <div className="w-2/3 mt-5 flex justify-center items-center flex-col">
        <button className="w-48 bg-stone-600 p-2 rounded-sm hover:bg-green-600">
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
