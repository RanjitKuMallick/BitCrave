const bcrypt = require('bcryptjs');
const db = require('./models/db');

async function setupAdmin() {
  try {
    console.log('🔧 Setting up default admin user...');
    
    // Check if admin already exists
    const [existingAdmins] = await db.query(
      'SELECT id FROM admins WHERE username = ?',
      ['admin']
    );

    if (existingAdmins.length > 0) {
      console.log('✅ Admin user already exists!');
      console.log('Username: admin');
      console.log('Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const [result] = await db.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );

    console.log('✅ Default admin user created successfully!');
    console.log('📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Admin ID:', result.insertId);
    console.log('');
    console.log('🔐 Please change the password after first login for security!');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Please run the database schema first:');
      console.log('   mysql -u your_user -p your_database < backend/sql/schema.sql');
    }
  } finally {
    process.exit(0);
  }
}

// Run the setup
setupAdmin();
