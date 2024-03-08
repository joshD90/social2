import React, { FC } from "react";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import TimeSincePosted from "../../microcomponents/timeSincePosted/TimeSincePosted";
import { MdNavigateNext } from "react-icons/md";

type Props = { comment: ICommentWithVotes };

const UserProfileComment: FC<Props> = ({ comment }) => {
  return (
    <div className="w-full text-stone-50 bg-blue-900 my-2 p-2 rounded-md">
      <div className="flex justify-between">
        <div className="flex text-sm mb-2">
          <p>
            {comment.firstName} {comment.lastName}
          </p>
          {!!comment.created_at && (
            <TimeSincePosted dateTime={comment.created_at} />
          )}
        </div>
        {!!comment.updated_at && (
          <TimeSincePosted dateTime={comment.updated_at} edited />
        )}
      </div>
      <div className="flex items-center justify-between">
        <p>{comment.comment}</p>
        <button className="text-2xl hover:scale-125 transition-transform">
          <MdNavigateNext />
        </button>
      </div>

      <p
        className={`${
          comment.total_votes >= 0 ? "text-green-50" : "text-red-50"
        }`}
      >
        {comment.total_votes}
      </p>
    </div>
  );
};

export default UserProfileComment;
