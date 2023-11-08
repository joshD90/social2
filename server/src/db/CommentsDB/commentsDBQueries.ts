const initCommentsTable =
  "CREATE TABLE IF NOT EXISTS comments(id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, service_id INT NOT NULL, comment VARCHAR(2000) NOT NULL, inReplyTo INT, hasReplies BOOL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP, updated_by_id INT, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (service_id) REFERENCES services(id), FOREIGN KEY (updated_by_id) REFERENCES users(id))";

const initVotesTable =
  "CREATE TABLE IF NOT EXISTS commentVotes(comment_id INT NOT NULL, user_id INT NOT NULL, vote_value INT NOT NULL, PRIMARY KEY (comment_id, user_id), FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)";

// const getParentCommentss = `
// SELECT comments.*, IFNULL(vote_counts.vote_count, 0) AS total_votes,
// user_details.firstName, user_details.lastName
//   FROM comments
//   LEFT JOIN
//   (SELECT id, firstName, lastName FROM users)
//   AS user_details ON comments.user_id = user_details.id
// LEFT JOIN (
//   SELECT comment_id, SUM(vote_value) AS vote_count
//   FROM commentVotes
//   GROUP BY comment_id
// ) AS vote_counts ON comments.id = vote_counts.comment_id
// WHERE service_id = ? AND comments.inReplyTo IS NULL
// ORDER BY total_votes DESC, hasReplies DESC, created_at DESC
// LIMIT ?
// OFFSET ?`;

const getParentComments = `
SELECT comments.*, IFNULL(vote_counts.vote_count, 0) AS total_votes,
user_details.firstName, user_details.lastName, organisations.name AS organisation
FROM comments 
LEFT JOIN 
(SELECT id, firstName, lastName, organisation FROM users) 
AS user_details ON comments.user_id = user_details.id
LEFT JOIN (
  SELECT comment_id, SUM(vote_value) AS vote_count
  FROM commentVotes
  GROUP BY comment_id
) AS vote_counts ON comments.id = vote_counts.comment_id 
LEFT JOIN organisations ON user_details.organisation = organisations.id
WHERE service_id = ? AND comments.inReplyTo IS NULL  AND organisations.name = ?
ORDER BY total_votes DESC, hasReplies DESC, created_at DESC
LIMIT ?
OFFSET ?;
`;

const getReplyComments = `
SELECT comments.*, IFNULL(vote_counts.vote_count, 0) AS total_votes, 
user_details.firstName, user_details.lastName, organisations.name as organisation
  FROM comments 
  LEFT JOIN 
  (SELECT id, firstName, lastName, organisation FROM users) 
  AS user_details ON comments.user_id = user_details.id
LEFT JOIN (
  SELECT comment_id, SUM(vote_value) AS vote_count
  FROM commentVotes
  GROUP BY comment_id
) AS vote_counts ON comments.id = vote_counts.comment_id 
LEFT JOIN organisations ON user_details.organisation = organisations.id
WHERE comments.inReplyTo = ? AND organisations.name = ?
ORDER BY total_votes DESC, hasReplies DESC, created_at DESC
LIMIT ?
OFFSET ?`;

const voteComment =
  "INSERT INTO commentVotes (comment_id, user_id, vote_value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE vote_value = ?";

export const commentQueryObj = {
  initCommentsTable,
  initVotesTable,
  getParentComments,
  voteComment,
  getReplyComments,
};
