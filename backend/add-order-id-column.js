const db = require('./models/db');

async function addOrderIdColumn() {
  try {
    console.log('Checking for order_id column...');
    
    // Check if order_id column exists
    const [columns] = await db.query("SHOW COLUMNS FROM reservations LIKE 'order_id'");
    
    if (columns.length === 0) {
      // Add order_id column
      await db.query('ALTER TABLE reservations ADD COLUMN order_id VARCHAR(50) UNIQUE');
      console.log('✅ Added order_id column to reservations table');
    } else {
      console.log('✅ order_id column already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addOrderIdColumn();
