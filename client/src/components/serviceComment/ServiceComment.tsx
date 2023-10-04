import { FC } from "react";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import { BsHandThumbsDownFill, BsHandThumbsUpFill } from "react-icons/bs";

type Props = { comment: ICommentWithVotes };

const ServiceComment: FC<Props> = ({ comment }) => {
  return (
    <div className="w-4/5 text-stone-50 mt-5">
      <p className="font-bold">
        {comment.firstName} {comment.lastName}
      </p>
      <p className="my-3">{comment.comment}</p>
      <div className="">
        <button>
          <BsHandThumbsUpFill />
        </button>
        <button>
          <BsHandThumbsDownFill />
        </button>
      </div>
    </div>
  );
};

export default ServiceComment;
