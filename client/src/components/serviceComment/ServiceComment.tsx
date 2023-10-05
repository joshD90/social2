import { FC, useContext } from "react";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import { BsHandThumbsDownFill, BsHandThumbsUpFill } from "react-icons/bs";
import TimeSincePosted from "../../microcomponents/timeSincePosted/TimeSincePosted";
import envIndex from "../../envIndex/envIndex";
import { AuthContext } from "../../context/authContext/AuthContext";
import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";

type Props = {
  comment: ICommentWithVotes;
  commentDispatch: React.Dispatch<TCommentReducerAction>;
};

const ServiceComment: FC<Props> = ({ comment, commentDispatch }) => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);

  const handleVote = async (voteValue: number) => {
    if (!user || !user.id || !comment.id) return;
    const url = `${envIndex.urls.baseUrl}/services/service/comments/vote`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          commentId: comment.id,
          voteValue,
        }),
      });
      if (!response.ok) throw Error(response.statusText);
      commentDispatch({
        type: "VOTE_COMMENT",
        payload: { commentId: comment.id, voteValue: voteValue },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-4/5 text-stone-50 mt-5">
      <div className="flex gap-4 items-end">
        <p className="font-bold">
          {comment.firstName} {comment.lastName}
        </p>
        {comment.created_at && (
          <div className="text-xs">
            <TimeSincePosted dateTime={comment.created_at} />
          </div>
        )}
      </div>
      <p className="mb-1">{comment.comment}</p>
      <div className="flex gap-2">
        <button className="hover:text-green-200" onClick={() => handleVote(1)}>
          <BsHandThumbsUpFill />
        </button>
        {comment.total_votes > 0 ? <span>{comment.total_votes}</span> : null}
        <button className="hover:text-red-200" onClick={() => handleVote(-1)}>
          <BsHandThumbsDownFill />
        </button>
        {comment.total_votes < 0 ? <span>{comment.total_votes}</span> : null}
      </div>
    </div>
  );
};

export default ServiceComment;
