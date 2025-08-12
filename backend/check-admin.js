const db = require('./models/db');
const bcrypt = require('bcryptjs');

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user in database...');
    
    // Check if admins table exists
    const [tables] = await db.query('SHOW TABLES LIKE "admins"');
    if (tables.length === 0) {
      console.log('❌ Admins table does not exist!');
      return;
    }
    console.log('✅ Admins table exists');
    
    // Get all admins
    const [admins] = await db.query('SELECT * FROM admins');
    console.log(`📊 Found ${admins.length} admin(s) in database`);
    
    if (admins.length === 0) {
      console.log('❌ No admin users found!');
      console.log('💡 Run: node setup-admin.js to create admin user');
      return;
    }
    
    // Check each admin
    for (const admin of admins) {
      console.log(`\n👤 Admin ID: ${admin.id}`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Created: ${admin.created_at}`);
      console.log(`   Last Logout: ${admin.last_logout || 'Never'}`);
      
      // Test password
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, admin.password);
      console.log(`   Password 'admin123' valid: ${isValid ? '✅' : '❌'}`);
      
      if (!isValid) {
        console.log('   💡 Password mismatch - admin user may have different password');
      }
    }
    
    // Try to create a new admin with correct password
    console.log('\n🔧 Creating fresh admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Delete existing admin first
    await db.query('DELETE FROM admins WHERE username = ?', ['admin']);
    
    // Create new admin
    const [result] = await db.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );
    
    console.log('✅ Fresh admin user created!');
    console.log('📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Admin ID:', result.insertId);
    
  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
  } finally {
    process.exit(0);
  }
}

checkAdmin();
