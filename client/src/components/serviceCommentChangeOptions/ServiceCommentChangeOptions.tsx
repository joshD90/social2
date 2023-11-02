import { FC } from "react";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import { IUser } from "../../types/userTypes/UserTypes";
import { MdDelete } from "react-icons/md";
import envIndex from "../../envIndex/envIndex";

type Props = { user: IUser | null; comment: ICommentWithVotes };

const ServiceCommentChangeOptions: FC<Props> = ({ user, comment }) => {
  const handleDelete = async () => {
    const abortController = new AbortController();
    const deleteUrl = `${envIndex.urls.baseUrl}/services/service/comments/${comment.id}`;
    try {
      const response = await fetch(deleteUrl, {
        credentials: "include",
        signal: abortController.signal,
        method: "DELETE",
      });
      if (!response.ok) throw Error(response.statusText);
      console.log("Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) return null;
  if (
    !(user.privileges === "moderator") &&
    !(user.privileges === "admin") &&
    !(user.id === comment.user_id)
  )
    return null;

  return (
    <button className="flex" onClick={handleDelete}>
      <MdDelete />
    </button>
  );
};

export default ServiceCommentChangeOptions;
