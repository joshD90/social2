export interface ICommentBase {
  id?: number;
  service_id: number;
  user_id: number;
  inReplyTo?: number;
  hasReplies?: boolean;
  created_at?: string;
  updated_at?: string;
  updated_by_id?: number;
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
