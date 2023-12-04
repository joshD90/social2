const initServiceEmailsTable = `
CREATE TABLE IF NOT EXISTS service_email_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  details VARCHAR(200) NOT NULL,
  service_id INT,
  phone_number VARCHAR(100) NOT NULL,
  public BOOLEAN DEFAULT false,
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
)
`;

export { initServiceEmailsTable };
