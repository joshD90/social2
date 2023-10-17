import { FC, useState } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";
import envIndex from "../../../envIndex/envIndex";

type Props = { user: IUser };

const AdminSingleUser: FC<Props> = ({ user }) => {
  const [approved, setApproved] = useState(user && user.privileges !== "none");

  const handlePrivilegeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = `${envIndex.urls.baseUrl}/users/privileges`;
    const approvedValue = e.target.checked;
    const body = {
      userToUpdateId: user.id,
      newPrivilege: approvedValue ? "approved" : "none",
    };
    console.log("just before await");
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      console.log(response);
      if (!response.ok) throw Error(response.statusText);
      console.log(approvedValue);
      setApproved(approvedValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr className="my-5">
      <td className="py-2">{user.email}</td>
      <td className="py-2">
        {user.firstName} {user.lastName}
      </td>
      <td className="py-2">{user.organisation}</td>
      <td className="py-2">
        {user.privileges === "admin" || user.privileges === "moderator" ? (
          user.privileges
        ) : (
          <div className="flex items-center gap-2">
            <p>Approved?</p>
            <input
              type="checkbox"
              onChange={handlePrivilegeChange}
              checked={approved}
            />
          </div>
        )}
      </td>
    </tr>
  );
};

export default AdminSingleUser;
