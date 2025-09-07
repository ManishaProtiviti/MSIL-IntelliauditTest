CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  session_id VARCHAR(100),
  process_timestamp DATETIME,
  document_name VARCHAR(100),

  duplication VARCHAR(10),
  pdf_edit VARCHAR(10),
  metadata VARCHAR(10),
  copymove VARCHAR(10),
  image_edit VARCHAR(10),
  qr_code VARCHAR(10),
  risk_flag VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_status (
  id INT IDENTITY(1,1),
  employee_id INT NOT NULL,
  session_id VARCHAR(100),
  process_timestamp TIMESTAMP,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
DISTSTYLE AUTO
SORTKEY (employee_id);
