const initServicePhones = `
  CREATE TABLE IF NOT EXISTS service_phone_numbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    details VARCHAR(200),
    service_id INT,
    phone_number VARCHAR(100),
    public BOOLEAN DEFAULT false,
    FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
  );
`;

export default { initServicePhones };
