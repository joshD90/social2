import { FC, useEffect, useReducer } from "react";
// import { AuthContext } from "../../context/authContext/AuthContext";
import useGetFetch from "../../hooks/useGetFetch";
import envIndex from "../../envIndex/envIndex";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";
import ServiceComment from "../../components/serviceComment/ServiceComment";
import { commentReducer } from "../../reducers/commentReducer/commentReducer";

type Props = { serviceId: string };

const ServiceCommentsContainer: FC<Props> = ({ serviceId }) => {
  // const {currentUser:{user}} = useContext(AuthContext);//dont know if i even need this
  const [comments, dispatch] = useReducer(commentReducer, []);

  // const { fetchedData } = useGetFetch<ICommentWithVotes[]>(
  //   `${envIndex.urls.baseUrl}/services/service/comments?serviceId=${serviceId}`
  // );

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
    <section className="w-full">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <ServiceComment comment={comment} key={comment.id} />
      ))}
    </section>
  );
};

export default ServiceCommentsContainer;
