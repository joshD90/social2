import { Dispatch, FC, useCallback, useEffect, useState } from "react";

import envIndex from "../../envIndex/envIndex";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import ServiceComment from "../../components/serviceComment/ServiceComment";

import ServiceCommentForm from "../../components/serviceCommentForm/ServiceCommentForm";
import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";

type Props = {
  serviceId: string;
  parentCommentId?: number;
  commentDispatch: Dispatch<TCommentReducerAction>;
  comments: ICommentWithVotes[];
};

const ServiceCommentsContainer: FC<Props> = ({
  serviceId,
  parentCommentId,
  commentDispatch,
  comments,
}) => {
  // const {currentUser:{user}} = useContext(AuthContext);//dont know if i even need this

  const [serviceIdNum, setServiceIdNum] = useState<number>(parseInt(serviceId));
  const [offsetCount, setOffsetCount] = useState(0);

  //convert to number format any time serviceId changes
  useEffect(() => setServiceIdNum(() => parseInt(serviceId)), [serviceId]);

  const fetchCommentsCallback = useCallback(
    async (
      refresh: boolean,
      commentDispatch: Dispatch<TCommentReducerAction>,
      abortController?: AbortController,
      offSet?: number
    ) => {
      const url = !parentCommentId
        ? `${
            envIndex.urls.baseUrl
          }/services/service/comments?serviceId=${serviceIdNum}&offset=${
            offSet ? offSet : 0
          }`
        : `${
            envIndex.urls.baseUrl
          }/services/service/comments?parentCommentId=${parentCommentId}&offset=${
            offSet ? offSet : 0
          }`;
      try {
        const response = await fetch(url, {
          signal: abortController ? abortController.signal : null,
          credentials: "include",
        });
        if (!response.ok) throw Error(response.statusText);
        const responseComments = await response.json();

        refresh && commentDispatch({ type: "CLEAR_COMMENTS" });
        commentDispatch({
          type: "ADD_COMMENTS",
          payload: responseComments as ICommentWithVotes[],
        });
      } catch (error) {
        console.log(error, "error in fetching the comments");
      }
    },
    [serviceIdNum, parentCommentId]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchCommentsCallback(true, commentDispatch, abortController);
    return () => abortController.abort();
  }, [fetchCommentsCallback, commentDispatch]);

  return (
    <section className="w-full px-4 pb-5">
      <h2 className="text-stone-50 text-xl">Comments</h2>
      <ServiceCommentForm
        commentDispatch={commentDispatch}
        serviceId={serviceIdNum}
      />
      {comments.map((comment) => (
        <ServiceComment
          comment={comment}
          key={comment.id}
          commentDispatch={commentDispatch}
          fetchCommentsCallback={fetchCommentsCallback}
        />
      ))}
    </section>
  );
};

export default ServiceCommentsContainer;
