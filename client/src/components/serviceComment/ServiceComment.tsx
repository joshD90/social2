import {
  Dispatch,
  FC,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import { BsHandThumbsDownFill, BsHandThumbsUpFill } from "react-icons/bs";
import TimeSincePosted from "../../microcomponents/timeSincePosted/TimeSincePosted";
import envIndex from "../../envIndex/envIndex";
import { AuthContext } from "../../context/authContext/AuthContext";
import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";
import { commentReducer } from "../../reducers/commentReducer/commentReducer";
import ServiceCommentsContainer from "../../pages/serviceCommentsContainer/ServiceCommentsContainer";
import ServiceCommentForm from "../serviceCommentForm/ServiceCommentForm";
import { MdDelete } from "react-icons/md";
import ServiceCommentChangeOptions from "../serviceCommentChangeOptions/ServiceCommentChangeOptions";

type Props = {
  comment: ICommentWithVotes;
  commentDispatch: React.Dispatch<TCommentReducerAction>;
  serviceId: string;
};

const ServiceComment: FC<Props> = ({ comment, commentDispatch, serviceId }) => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);
  const [replyComments, replyCommentDispatch] = useReducer(commentReducer, []);
  const [repliesToggled, setRepliesToggled] = useState(false);
  const [serviceIdNum, setServiceIdNum] = useState(parseInt(serviceId));

  useEffect(() => setServiceIdNum(parseInt(serviceId)), [serviceId]);

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

  const manageReplies = () => {
    setRepliesToggled((prev) => !prev);
  };

  return (
    <div className=" text-stone-50 mt-5">
      <div className="flex gap-4 items-center justify-between">
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
        <ServiceCommentChangeOptions user={user} comment={comment} />
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

      <div>
        <button onClick={manageReplies}>Replies</button>
        {repliesToggled ? (
          <div className="pl-5">
            <ServiceCommentForm
              serviceId={serviceIdNum}
              commentDispatch={replyCommentDispatch}
              parentCommentId={comment.id}
            />
            {comment.hasReplies ? (
              <ServiceCommentsContainer
                serviceId={serviceId}
                commentDispatch={replyCommentDispatch}
                comments={replyComments}
                parentCommentId={comment.id}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ServiceComment;
