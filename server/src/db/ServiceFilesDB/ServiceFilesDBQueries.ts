const initTable = `
  CREATE TABLE IF NOT EXISTS service_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL UNIQUE,
    service_id INT,
    url VARCHAR(255) NOT NULL,
    bucket_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
  )
`;

export default { initTable };
