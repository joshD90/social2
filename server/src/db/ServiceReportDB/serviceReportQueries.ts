const initTable =
  "CREATE TABLE IF NOT EXISTS serviceReports (id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, serviceId INT NOT NULL, report VARCHAR(3000) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'incomplete', updated_at TIMESTAMP, FOREIGN KEY (userId) REFERENCES users(id), FOREIGN KEY (serviceId) REFERENCES services(id));";

const updateRecordStatus =
  "UPDATE serviceReports SET updated_at = NOW(), status = ? WHERE id = ?";

const queryObj = { initTable, updateRecordStatus };

export default queryObj;
