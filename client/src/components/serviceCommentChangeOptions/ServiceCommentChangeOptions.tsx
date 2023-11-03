import { Dispatch, FC } from "react";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import { IUser } from "../../types/userTypes/UserTypes";
import { MdDelete } from "react-icons/md";
import envIndex from "../../envIndex/envIndex";
import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";

type Props = {
  user: IUser | null;
  comment: ICommentWithVotes;
  commentsDispatch: Dispatch<TCommentReducerAction>;
};

const ServiceCommentChangeOptions: FC<Props> = ({
  user,
  comment,
  commentsDispatch,
}) => {
  const handleDelete = async () => {
    if (!comment.id) return;
    const abortController = new AbortController();
    const deleteUrl = `${envIndex.urls.baseUrl}/services/service/comments/${comment.id}`;
    try {
      const response = await fetch(deleteUrl, {
        credentials: "include",
        signal: abortController.signal,
        method: "DELETE",
      });
      if (!response.ok) throw Error(response.statusText);
      commentsDispatch({
        type: "REMOVE_COMMENTS_BY_ID",
        payload: [comment.id],
      });
    } catch (error) {
      //TODO: This needs to have proper error handling, I am not sure where I want to put the error handling into - could I hold comment errors at the top of the comment container? As the comment section is iterable and holds the replies it might have to go to the top of the parent container.
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
