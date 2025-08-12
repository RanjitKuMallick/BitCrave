const db = require('./config/db');

async function addFirebaseFields() {
  try {
    console.log('🔄 Adding Firebase fields to users table...');

    // Check if firebase_uid column exists
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bitcrave' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'firebase_uid'
    `);

    if (columns.length === 0) {
      // Add firebase_uid column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN firebase_uid VARCHAR(255) UNIQUE,
        ADD COLUMN photo_url TEXT,
        ADD COLUMN auth_type ENUM('database', 'firebase', 'google') DEFAULT 'database'
      `);
      console.log('✅ Added firebase_uid, photo_url, and auth_type columns');
    } else {
      console.log('ℹ️ Firebase fields already exist');
    }

    // Add index for better performance
    try {
      await db.query('CREATE INDEX idx_firebase_uid ON users(firebase_uid)');
      console.log('✅ Added index on firebase_uid');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Index already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Firebase migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addFirebaseFields();
