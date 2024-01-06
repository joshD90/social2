const initTable = `
CREATE TABLE IF NOT EXISTS email_confirmation_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    associated_key VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMP AS (creation_time + INTERVAL 24 HOUR),
    FOREIGN KEY (email) REFERENCES users (email) ON DELETE CASCADE
);
`;

const findKeyEmailPair = `SELECT * FROM email_confirmation_keys WHERE email = ? and associated_key = ?`;

export default { initTable, findKeyEmailPair };
