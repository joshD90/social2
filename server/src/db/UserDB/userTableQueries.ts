const initUserTable =
  "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, privileges VARCHAR(30) NOT NULL, password VARCHAR(255) NOT NULL, organisation INT NOT NULL, FOREIGN KEY(organisation) REFERENCES organisations(id))";

const initOrganisationTable =
  "CREATE TABLE IF NOT EXISTS organisations(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL)";

const generateFindUserQuery = (
  columnName: "users.id" | "email" | "organisation"
): string => {
  const modifiedColName =
    columnName === "organisation" ? "organisations.name" : columnName;
  return `SELECT users.id, users.email, users.firstName, users.lastName, users.privileges, users.password, organisations.name AS organisation FROM users JOIN organisations ON users.organisation = organisations.id WHERE ${modifiedColName} = ?`;
};

const findAllUsers = `SELECT users.id, firstName, lastName, email, privileges, organisations.name AS organisation FROM users JOIN organisations ON users.organisation = organisations.id`;

const getAllOrganisationsNames = "SELECT name FROM organisations";

const updatePrivileges = "UPDATE users SET privileges = ? WHERE id = ?";

export default {
  initUserTable,
  initOrganisationTable,
  generateFindUserQuery,
  updatePrivileges,
  findAllUsers,
  getAllOrganisationsNames,
};
