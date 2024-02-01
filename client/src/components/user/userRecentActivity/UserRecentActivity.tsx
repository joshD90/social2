import { FC } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";
import useGetFetch from "../../../hooks/useGetFetch";
import envIndex from "../../../envIndex/envIndex";

type Props = {
  user: IUser;
};

const UserRecentActivity: FC<Props> = ({ user }) => {
  const { fetchedData: comments, setFetchedData: setComments } = useGetFetch<
    IUser[]
  >(`${envIndex.urls.baseUrl}/users/comments/${user.id}`, []);

  return (
    <div>
      {comments?.map((comment) => (
        <p>{JSON.stringify(comment)}</p>
      ))}
    </div>
  );
};

export default UserRecentActivity;
