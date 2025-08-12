use bitcrave;
-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  last_logout TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Firebase-based users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  last_logout TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blacklisted tokens table for secure logout
CREATE TABLE IF NOT EXISTS blacklisted_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT NOT NULL,
  user_id INT NULL,
  admin_id INT NULL,
  blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token(255)),
  INDEX idx_user_id (user_id),
  INDEX idx_admin_id (admin_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  date DATE NOT NULL,
  time TIME NOT NULL,
  people INT NOT NULL,
  table_number INT,
  status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
  payment_status ENUM('Pending', 'Paid') DEFAULT 'Pending',
  message TEXT,
  order_items JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu table with type column
CREATE TABLE IF NOT EXISTS menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  type VARCHAR(20),
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tables table
CREATE TABLE tables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_number VARCHAR(10) UNIQUE NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(50),
  status ENUM('available', 'maintenance') DEFAULT 'available'
);

-- Insert 15 tables with specified capacity distribution
-- Tables 1-5: Capacity 1-2 people
INSERT INTO tables (table_number, capacity, location) VALUES
('T1', 2, 'Window'),
('T2', 2, 'Window'),
('T3', 1, 'Counter'),
('T4', 2, 'Balcony'),
('T5', 1, 'Counter'),

-- Tables 6-10: Capacity 2-4 people
('T6', 4, 'Center'),
('T7', 3, 'Center'),
('T8', 4, 'Patio'),
('T9', 2, 'Corner'),
('T10', 4, 'Garden'),

-- Tables 11-15: Capacity 6+ people
('T11', 6, 'Private Room'),
('T12', 8, 'Main Hall'),
('T13', 6, 'Terrace'),
('T14', 10, 'Banquet'),
('T15', 12, 'VIP Section');

-- Modify reservations table
ALTER TABLE reservations ADD COLUMN table_id INT;
ALTER TABLE reservations ADD COLUMN slot_number INT DEFAULT 1;
ALTER TABLE reservations ADD FOREIGN KEY (table_id) REFERENCES tables(id);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table assignments (which staff member is assigned to which table)
CREATE TABLE IF NOT EXISTS staff_table_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  table_number VARCHAR(10) NOT NULL,
  assigned_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  UNIQUE KEY unique_staff_table_date (staff_id, table_number, assigned_date)
);

-- Insert demo staff members
INSERT INTO staff (staff_id, name, email, phone) VALUES
(1, 'John Smith', 'john@bitcrave.com', '1234567890'),
(2, 'Sarah Johnson', 'sarah@bitcrave.com', '1234567891'),
(3, 'Mike Wilson', 'mike@bitcrave.com', '1234567892');