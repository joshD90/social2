import { FC } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";

type Props = { user: IUser };

const AdminSingleUser: FC<Props> = ({ user }) => {
  return (
    <div className="flex">
      <p>{user.email}</p>
      <p>
        {user.firstName} {user.lastName}
      </p>
      <p>{user.organisation}</p>
    </div>
  );
};

export default AdminSingleUser;
