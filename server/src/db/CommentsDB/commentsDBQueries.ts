const initCommentsTable =
  "CREATE TABLE IF NOT EXISTS comments(id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, service_id INT NOT NULL, comment VARCHAR(2000) NOT NULL, inReplyTo INT, hasReplies BOOL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (service_id) REFERENCES services(id))";

const initVotesTable =
  "CREATE TABLE IF NOT EXISTS commentVotes(comment_id INT NOT NULL, user_id INT NOT NULL, vote_value INT NOT NULL, PRIMARY KEY (comment_id, user_id), FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)";

const getParentComments = `
SELECT comments.*, IFNULL(vote_counts.vote_count, 0) AS total_votes 
FROM comments 
LEFT JOIN (
  SELECT comment_id, COUNT(*) AS vote_count
  FROM commentVotes
  GROUP BY comment_id
) AS vote_counts ON comments.id = vote_counts.comment_id 
WHERE service_id = ? AND comments.inReplyTo IS NULL
ORDER BY total_votes DESC, hasReplies DESC, created_at DESC
LIMIT ?
OFFSET ?`;

const getReplyComments = `
SELECT comments.*, IFNULL(vote_counts.vote_count, 0) AS total_votes 
FROM comments 
LEFT JOIN (
  SELECT comment_id, COUNT(*) AS vote_count
  FROM commentVotes
  GROUP BY comment_id
) AS vote_counts ON comments.id = vote_counts.comment_id 
WHERE comments.inReplyTo = ?
ORDER BY total_votes DESC, hasReplies DESC, created_at DESC
LIMIT ?
OFFSET ?`;

const voteComment =
  "INSERT INTO comment_votes (comment_id, user_id, vote_value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE vote_value = ?";

export const commentQueryObj = {
  initCommentsTable,
  initVotesTable,
  getParentComments,
  voteComment,
  getReplyComments,
};
