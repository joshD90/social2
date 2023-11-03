import React, { Dispatch, FC, useCallback, useEffect, useState } from "react";

import envIndex from "../../envIndex/envIndex";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import ServiceComment from "../../components/serviceComment/ServiceComment";

import ServiceCommentForm from "../../components/serviceCommentForm/ServiceCommentForm";
import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";
import AdminOrganisationsSelector from "../../components/admin/adminOrganisationsSelector/AdminOrganisationsSelector";

type Props = {
  serviceId: string;
  parentCommentId?: number;
  adminSelect?: boolean;
  commentDispatch: Dispatch<TCommentReducerAction>;
  comments: ICommentWithVotes[];
};

const ServiceCommentsContainer: FC<Props> = ({
  serviceId,
  parentCommentId,
  commentDispatch,
  comments,
  adminSelect,
}) => {
  const [serviceIdNum, setServiceIdNum] = useState<number>(parseInt(serviceId));
  const [offsetCount, setOffsetCount] = useState(0);
  const [loadMoreActive, setLoadMoreActive] = useState(true);
  const [adminOrgSelect, setAdminOrgSelect] = useState("");

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
          }${adminOrgSelect !== "" ? `&queryorg=${adminOrgSelect}` : null}`
        : `${
            envIndex.urls.baseUrl
          }/services/service/comments?serviceId=${serviceIdNum}&parentCommentId=${parentCommentId}&offset=${
            offSet ? offSet : 0
          }${adminOrgSelect !== "" ? `&queryorg=${adminOrgSelect}` : null}`;
      try {
        const response = await fetch(url, {
          signal: abortController ? abortController.signal : null,
          credentials: "include",
        });
        if (!response.ok) throw Error(response.statusText);
        const responseComments = await response.json();

        if (responseComments.length < 5) setLoadMoreActive(false);

        refresh && commentDispatch({ type: "CLEAR_COMMENTS" });
        commentDispatch({
          type: "ADD_COMMENTS",
          payload: responseComments as ICommentWithVotes[],
        });
      } catch (error) {
        console.log(error, "error in fetching the comments");
      }
    },
    [serviceIdNum, parentCommentId, adminOrgSelect]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchCommentsCallback(true, commentDispatch, abortController);
    return () => abortController.abort();
  }, [fetchCommentsCallback, commentDispatch]);

  const loadMoreComments = () => {
    fetchCommentsCallback(false, commentDispatch, undefined, offsetCount + 5);
    console.log(offsetCount);
    setOffsetCount((prev) => prev + 5);
  };

  const handleAdminOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdminOrgSelect(e.target.value);
  };

  return (
    <section className={`w-full ${!parentCommentId ? "px-5" : ""} pb-5 `}>
      <div className="flex justify-between items-center">
        {!parentCommentId && (
          <h2 className="text-stone-50 text-xl">Comments</h2>
        )}
        {adminSelect && (
          <AdminOrganisationsSelector
            handleOrgSelection={handleAdminOrgChange}
          />
        )}
      </div>
      {!parentCommentId && (
        <ServiceCommentForm
          commentDispatch={commentDispatch}
          serviceId={serviceIdNum}
        />
      )}
      {comments.map((comment) => (
        <ServiceComment
          comment={comment}
          key={comment.id}
          commentDispatch={commentDispatch}
          serviceId={serviceId}
        />
      ))}
      <button
        className={` cursor-pointer rounded-md ${
          !loadMoreActive
            ? "bg-stone-600 text-stone-400 cursor-not-allowed"
            : "bg-stone-50 text-stone-50"
        } bg-opacity-5 p-2 `}
        onClick={loadMoreComments}
        disabled={!loadMoreActive}
      >
        Load More {parentCommentId ? "Replies" : "Comments"}
      </button>
    </section>
  );
};

export default ServiceCommentsContainer;
