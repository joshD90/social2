import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import envIndex from "../../../envIndex/envIndex";
import useGetFetch from "../../../hooks/useGetFetch";
import { IUser } from "../../../types/userTypes/UserTypes";
import AdminSingleUser from "../../../components/admin/adminSingleUser.tsx/AdminSingleUser";

const AdminUsersView: FC = () => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);
  const [fetchString, setFetchString] = useState("");
  const { fetchedData, error, loading } = useGetFetch<IUser[]>(fetchString, []);

  useEffect(() => {
    const baseUserUrl = `${envIndex.urls.baseUrl}/users`;
    if (!user) {
      setFetchString("");
      return;
    }
    if (user.privileges === "admin") {
      setFetchString(`${baseUserUrl}`);
      return;
    }
    if (user.privileges === "moderator") {
      setFetchString(`${baseUserUrl}/${user.organisation}`);
    }
  }, [user]);

  if (!fetchedData && loading) return <>Loading</>;
  if (error) return <>{error}</>;

  return (
    <div>
      {fetchedData?.map((user) => {
        return <AdminSingleUser user={user} />;
      })}
    </div>
  );
};

export default AdminUsersView;
