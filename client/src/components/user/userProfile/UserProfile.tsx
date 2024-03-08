import { FC } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";

type Props = { user: IUser };

const UserProfile: FC<Props> = ({ user }) => {
  return (
    <div className="bg-blue-800 shadow-md text-stone-50 w-full max-w-3xl p-5 rounded-lg">
      <h2 className="text-center text-2xl">Your Profile</h2>
      <p className="p-2 bg-blue-900 mt-4 rounded-md">
        Name: {user.firstName} {user.lastName}
      </p>
      <p className="p-2 bg-blue-900 mt-4 rounded-md">Email: {user.email}</p>
      <p className="p-2 bg-blue-900 mt-4 rounded-md">{user.organisation}</p>
      <p className="p-2 bg-blue-900 mt-4 rounded-md">{user.privileges}</p>
    </div>
  );
};

export default UserProfile;
