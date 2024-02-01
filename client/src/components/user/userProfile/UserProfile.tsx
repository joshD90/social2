import { FC } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";

type Props = { user: IUser };

const UserProfile: FC<Props> = ({ user }) => {
  return (
    <div className="bg-stone-600 shadow-md text-stone-50 w-full sm:w-4/5 md:w-1/2 lg:w-1/3 p-5 rounded-sm">
      <p>
        Name: {user.firstName} {user.lastName}
      </p>
      <p>Email: {user.email}</p>
      <p>{user.organisation}</p>
      <p>{user.privileges}</p>
    </div>
  );
};

export default UserProfile;
