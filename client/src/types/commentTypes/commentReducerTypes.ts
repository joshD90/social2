import { ICommentWithVotes } from "./commentTypes";

export type TCommentReducerAction =
  | {
      type: "ADD_COMMENTS";
      payload: ICommentWithVotes[];
    }
  | { type: "REMOVE_COMMENTS_BY_ID"; payload: number[] }
  | {
      type: "VOTE_COMMENT";
      payload: { commentId: number; voteValue: number };
    }
  | { type: "PREPEND_COMMENT_AFTER_CREATE"; payload: ICommentWithVotes }
  | { type: "UPDATE_COMMENT"; payload: ICommentWithVotes }
  | { type: "CLEAR_COMMENTS" };
