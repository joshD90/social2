const initUserTable =
  "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, privileges VARCHAR(30) NOT NULL, password VARCHAR(255) NOT NULL, organisation VARCHAR(255) NOT NULL)";

export default { initUserTable };
