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
  const { fetchedData: organisationNames } = useGetFetch<{ name: string }[]>(
    `${envIndex.urls.baseUrl}/users/organisations`
  );
  const { fetchedData, error, loading } = useGetFetch<IUser[]>(fetchString, []);
  const [adminSelectOrg, setAdminSelectOrg] = useState("");
  console.log(organisationNames);
  useEffect(() => {
    const baseUserUrl = `${envIndex.urls.baseUrl}/users`;
    if (!user) {
      setFetchString("");
      return;
    }
    if (user.privileges === "admin" && adminSelectOrg !== "") {
      setFetchString(`${baseUserUrl}?organisation=${adminSelectOrg}`);
      return;
    }
    if (user.privileges === "admin") {
      setFetchString(`${baseUserUrl}`);
      return;
    }
    if (user.privileges === "moderator") {
      setFetchString(`${baseUserUrl}?organisation=${user.organisation}`);
    }
  }, [user, adminSelectOrg]);

  const handleOrgSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdminSelectOrg(e.target.value);
  };

  if (!fetchedData && loading) return <>Loading</>;
  if (error) return <>{error}</>;

  return (
    <div className="bg-blue-950 min-h-screen">
      <div className="flex w-full items-center justify-between p-3">
        <h1 className="text-center text-stone-50 text-2xl justify-self-center">
          {adminSelectOrg} Users
        </h1>
        {user?.privileges === "admin" ? (
          <form className="justify-self-end">
            <div className="text-stone-50 flex gap-3">
              <label htmlFor="organisationSelect">Select Organisation</label>
              <select
                name="organisationSelect"
                className="text-stone-950"
                onChange={handleOrgSelection}
              >
                <option value="">None Selected</option>
                {organisationNames?.map((organisation) => (
                  <option value={organisation.name}>{organisation.name}</option>
                ))}
              </select>
            </div>
          </form>
        ) : null}
      </div>
      <div className=" w-full flex flex-col gap-3">
        {fetchedData?.map((user) => {
          return <AdminSingleUser user={user} key={user.email} />;
        })}
      </div>
    </div>
  );
};

export default AdminUsersView;
