import { TCommentReducerAction } from "../../types/commentTypes/commentReducerTypes";
import { ICommentWithVotes } from "../../types/commentTypes/commentTypes";

export const commentReducer = (
  state: ICommentWithVotes[],
  action: TCommentReducerAction
): ICommentWithVotes[] => {
  switch (action.type) {
    case "ADD_COMMENTS": {
      const updatedComments = [...state, ...action.payload].filter(
        (comment, index, self) => {
          return self.findIndex((el) => el.id === comment.id) === index;
        }
      );
      return updatedComments;
    }
    case "REMOVE_COMMENTS_BY_ID": {
      const updatedComments = state.filter((comment) => {
        if (!comment.id) return true;
        return !action.payload.includes(comment.id);
      });
      return updatedComments;
    }
    case "VOTE_COMMENT": {
      const updatedComments = state.map((comment) => {
        if (!comment.id) return comment;
        if (comment.id === action.payload.commentId) {
          const totalVotes = comment.total_votes + action.payload.voteValue;
          return { ...comment, total_votes: totalVotes };
        }
        return comment;
      });
      return updatedComments;
    }
    case "PREPEND_COMMENT_AFTER_CREATE": {
      const updatedComments = [action.payload, ...state];
      if (action.payload.inReplyTo)
        return updatedComments.map((comment) => {
          if (action.payload.inReplyTo === comment.id)
            return { ...comment, hasReplies: true };
          return comment;
        });
      return updatedComments;
    }
    case "UPDATE_COMMENT": {
      const updatedComments = state.map((comment) => {
        if (comment.id === action.payload.id) return action.payload;
        return comment;
      });
      return updatedComments;
    }
    case "CLEAR_COMMENTS": {
      return [];
    }
  }
};
