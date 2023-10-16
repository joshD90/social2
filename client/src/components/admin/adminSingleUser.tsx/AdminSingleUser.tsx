import { FC } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";

type Props = { user: IUser };

const AdminSingleUser: FC<Props> = ({ user }) => {
  return (
    <div className="flex gap-3 flex-wrap bg-stone-700 text-stone-50 p-3">
      <p>{user.email}</p>
      <p>
        {user.firstName} {user.lastName}
      </p>
      <p>{user.organisation}</p>
    </div>
  );
};

export default AdminSingleUser;
