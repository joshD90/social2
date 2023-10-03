export interface ICommentBase {
  id?: number;
  service_id: number;
  user_id: number;
  inReplyTo?: number;
  hasReplies?: boolean;
  created_at?: string;
  comment: string;
}

export interface ICommentWithVotes {
  total_votes: number;
}

export interface IVote {
  commentId: number;
  userId: number;
  voteValue: number;
}
