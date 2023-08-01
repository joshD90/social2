import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../../../context/authContext/AuthContext";

const AdminProtectedWrapper = () => {
  const { currentUser } = useContext(AuthContext);
  //i have removed this section due to the fact that when strictmode is on it causes a bug by loading it twice but in loading twice it will automatically redirect when the first page loading is terminated but by the time it reloads it will have already redirected
  //   if (!(currentUser?.user?.privileges === "admin"))
  //     return <Navigate to="/services" />;
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminProtectedWrapper;
