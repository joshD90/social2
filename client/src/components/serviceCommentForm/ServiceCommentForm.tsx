import { FC, useContext, useState, Dispatch } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import {
  ICommentBase,
  ICommentWithVotes,
} from "../../types/commentTypes/commentTypes";
import envIndex from "../../envIndex/envIndex";
import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";
import { MdSend } from "react-icons/md";

type Props = {
  serviceId: number;
  commentDispatch: Dispatch<TCommentReducerAction>;
  parentCommentId?: number;
};

const ServiceCommentForm: FC<Props> = ({
  serviceId,
  commentDispatch,
  parentCommentId,
}) => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const abortController = new AbortController();
    if (!user || !user.id || commentText === "") return;
    const commentToSubmit: ICommentBase = {
      user_id: user.id,
      service_id: serviceId,
      comment: commentText,
    };
    if (parentCommentId) commentToSubmit.inReplyTo = parentCommentId;

    const url = `${envIndex.urls.baseUrl}/services/service/comments`;
    try {
      const response = await fetch(url, {
        signal: abortController.signal,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(commentToSubmit),
      });
      if (!response.ok) throw Error(response.statusText);
      const data = await response.json();
      const createdComment: ICommentWithVotes = {
        ...commentToSubmit,
        created_at: JSON.stringify(Date.now()),
        total_votes: 0,
        firstName: user.firstName,
        lastName: user.lastName,
        id: data.newId,
      };
      commentDispatch({
        type: "PREPEND_COMMENT_AFTER_CREATE",
        payload: createdComment,
      });
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="py-1 text-stone-50">
        <div>
          <label htmlFor="newCommentInput" className="text-sm">
            Add Your Own Comment
          </label>
          <div className="w-full flex">
            <input
              type="text"
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
              className="w-full p-1 rounded-md text-stone-900 px-2"
            />
            <button
              className="text-2xl ml-2 hover:text-stone-300"
              type="submit"
            >
              <MdSend />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceCommentForm;
