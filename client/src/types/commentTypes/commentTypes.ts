export interface ICommentBase {
  id?: number;
  service_id: number;
  user_id: number;
  inReplyTo?: number;
  hasReplies?: boolean;
  created_at?: string;
  comment: string;
}

export interface ICommentWithVotes extends ICommentBase {
  total_votes: number;
  firstName: string;
  lastName: string;
}

export interface IVote {
  commentId: number;
  userId: number;
  voteValue: number;
}
