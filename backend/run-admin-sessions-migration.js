const db = require('./models/db');

async function runMigration() {
  try {
    console.log('🔄 Running admin sessions migration...');

    // Create admin_sessions table
    await db.query(`
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
      )
    `);

    // Add session management columns to admins table
    try {
      await db.query('ALTER TABLE admins ADD COLUMN last_login TIMESTAMP NULL');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }
    
    try {
      await db.query('ALTER TABLE admins ADD COLUMN last_logout TIMESTAMP NULL');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }
    
    try {
      await db.query('ALTER TABLE admins ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }

    // Create index for better performance
    try {
      await db.query('CREATE INDEX idx_admin_sessions_active ON admin_sessions(is_active, expires_at)');
    } catch (error) {
      if (!error.message.includes('Duplicate key name')) {
        throw error;
      }
    }

    // Clean up any expired sessions
    await db.query(`
      DELETE FROM admin_sessions WHERE expires_at < NOW()
    `);

    console.log('✅ Admin sessions migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
