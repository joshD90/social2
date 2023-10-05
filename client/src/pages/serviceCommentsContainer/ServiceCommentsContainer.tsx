import { FC, useEffect, useReducer, useState } from "react";
// import { AuthContext } from "../../context/authContext/AuthContext";
import useGetFetch from "../../hooks/useGetFetch";
import envIndex from "../../envIndex/envIndex";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import ServiceComment from "../../components/serviceComment/ServiceComment";
import { commentReducer } from "../../reducers/commentReducer/commentReducer";
import ServiceCommentForm from "../../components/serviceCommentForm/ServiceCommentForm";

type Props = { serviceId: string };

const ServiceCommentsContainer: FC<Props> = ({ serviceId }) => {
  // const {currentUser:{user}} = useContext(AuthContext);//dont know if i even need this
  const [comments, dispatch] = useReducer(commentReducer, []);
  const [serviceIdNum, setServiceIdNum] = useState<number>(parseInt(serviceId));
  // const { fetchedData } = useGetFetch<ICommentWithVotes[]>(
  //   `${envIndex.urls.baseUrl}/services/service/comments?serviceId=${serviceId}`
  // );
  //convert to number format any time serviceId changes
  useEffect(() => setServiceIdNum(parseInt(serviceId)), [serviceId]);

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const url = `${envIndex.urls.baseUrl}/services/service/comments?serviceId=${serviceId}`;
      try {
        const response = await fetch(url, {
          signal: abortController.signal,
          credentials: "include",
        });
        if (!response.ok) throw Error(response.statusText);
        const responseComments = await response.json();
        console.log(responseComments);
        dispatch({ type: "CLEAR_COMMENTS" });
        dispatch({
          type: "ADD_COMMENTS",
          payload: responseComments as ICommentWithVotes[],
        });
      } catch (error) {
        console.log(error, "error in fetching the comments");
      }
    })();
    return () => abortController.abort();
  }, [serviceId]);

  return (
    <section className="w-full px-4 pb-5">
      <h2 className="text-stone-50 text-xl">Comments</h2>
      <ServiceCommentForm commentDispatch={dispatch} serviceId={serviceIdNum} />
      {comments.map((comment) => (
        <ServiceComment
          comment={comment}
          key={comment.id}
          commentDispatch={dispatch}
        />
      ))}
    </section>
  );
};

export default ServiceCommentsContainer;
