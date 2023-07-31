import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../../../context/authContext/AuthContext";

const AdminProtectedWrapper = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  console.log(currentUser?.user?.privileges);
  if (!(currentUser?.user?.privileges === "admin"))
    return <Navigate to="/services" />;
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminProtectedWrapper;
