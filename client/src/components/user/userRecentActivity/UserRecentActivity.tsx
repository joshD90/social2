import { FC } from "react";
import { IUser } from "../../../types/userTypes/UserTypes";
import useGetFetch from "../../../hooks/useGetFetch";
import envIndex from "../../../envIndex/envIndex";
import UserProfileComment from "../../userProfileComment/UserProfileComment";
import { ICommentWithVotes } from "../../../types/commentTypes/commentTypes";

type Props = {
  user: IUser;
};

const UserRecentActivity: FC<Props> = ({ user }) => {
  const { fetchedData: comments, setFetchedData: setComments } = useGetFetch<
    ICommentWithVotes[]
  >(`${envIndex.urls.baseUrl}/users/comments/${user.id}`, []);

  return (
    <div className="bg-blue-800 shadow-md text-stone-50 w-full max-w-3xl p-5 rounded-lg">
      {comments?.map((comment) => (
        <UserProfileComment comment={comment} />
      ))}
    </div>
  );
};

export default UserRecentActivity;
