-- Migration script to add admin sessions table
USE bitcrave;

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_session_token (session_token),
  INDEX idx_admin_id (admin_id),
  INDEX idx_expires_at (expires_at)
);

-- Add session management columns to admins table if they don't exist
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS last_logout TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON admin_sessions(is_active, expires_at);

-- Clean up any expired sessions
DELETE FROM admin_sessions WHERE expires_at < NOW();

COMMIT;
