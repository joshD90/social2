import { ICommentWithVotes } from "./commentTypes";

export type TCommentReducerAction =
  | {
      type: "ADD_COMMENTS";
      payload: ICommentWithVotes[];
    }
  | { type: "REMOVE_COMMENTS_BY_ID"; payload: number[] }
  | {
      type: "VOTE_COMMENT";
      payload: { commentId: number; voteDirection: number };
    };
