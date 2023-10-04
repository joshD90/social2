import { FC, useContext, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { ICommentBase } from "../../types/commentTypes/commentTypes";
import envIndex from "../../envIndex/envIndex";

type Props = { serviceId: number };

const ServiceCommentForm: FC<Props> = ({ serviceId }) => {
  const {
    currentUser: { user },
  } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async () => {
    const abortController = new AbortController();
    if (!user || !user.id || commentText === "") return;
    const commentToSubmit: ICommentBase = {
      user_id: user.id,
      service_id: serviceId,
      comment: commentText,
    };
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>Add your own comment</p>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newCommentInput">Add Your Own Comment</label>
          <input
            type="text"
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
          />
        </div>
      </form>
    </div>
  );
};

export default ServiceCommentForm;
