CREATE DATABASE zitline_ip;
USE zitline_ip;

-- Tabel untuk menyimpan IP Address
CREATE TABLE ip_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ipAddress VARCHAR(45) NOT NULL,
  subnet VARCHAR(45) NOT NULL,
  assignedTo VARCHAR(100) DEFAULT 'Available',
  description TEXT,
  status VARCHAR(20) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan Log IP
CREATE TABLE access_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ipAddress VARCHAR(45) NOT NULL,
  userAgent VARCHAR(255),
  endpoint VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
