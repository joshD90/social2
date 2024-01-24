const initTableQuery =
  "CREATE TABLE IF NOT EXISTS password_reset_tokens(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, reset_token VARCHAR(255) NOT NULL, FOREIGN KEY (username) REFERENCES users(email))";

const findUserAndToken =
  "SELECT * FROM password_reset_tokens WHERE username = ? AND reset_token = ?";

export default { initTableQuery, findUserAndToken };
