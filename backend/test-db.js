const db = require('./config/db');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const connection = await db.getConnection();
    console.log('✅ Database connection successful!');
    connection.release();
    
    // Test if tables exist
    const [tables] = await db.query('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));
    
    // Test reservations table structure
    const [columns] = await db.query('DESCRIBE reservations');
    console.log('📊 Reservations table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
    // Test sample query
    const [reservations] = await db.query('SELECT COUNT(*) as count FROM reservations');
    console.log(`📈 Total reservations: ${reservations[0].count}`);
    
    // Test admin table
    const [admins] = await db.query('SELECT COUNT(*) as count FROM admins');
    console.log(`👥 Total admins: ${admins[0].count}`);
    
    // Test menu table
    const [menu] = await db.query('SELECT COUNT(*) as count FROM menu');
    console.log(`🍽️ Total menu items: ${menu[0].count}`);
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

testDatabaseConnection();
