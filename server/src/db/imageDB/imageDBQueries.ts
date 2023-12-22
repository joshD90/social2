const initImageTable = `
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT REFERENCES services(id),
    fileName VARCHAR(200),
    url VARCHAR(2000),
    bucket_name VARCHAR(250),
    main_pic BOOL DEFAULT 0
);
`;
export const queryObj = { initImageTable };
