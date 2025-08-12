const db = require('./config/db');

async function addColumns() {
  try {
    console.log('🔧 Adding missing columns to reservations table...');
    
    // Add status column
    try {
      await db.query('ALTER TABLE reservations ADD COLUMN status ENUM("Pending", "Confirmed", "Cancelled") DEFAULT "Pending"');
      console.log('✅ Added status column');
    } catch (e) {
      console.log('⚠️ Status column already exists or error:', e.message);
    }
    
    // Add payment_status column
    try {
      await db.query('ALTER TABLE reservations ADD COLUMN payment_status ENUM("Pending", "Paid") DEFAULT "Pending"');
      console.log('✅ Added payment_status column');
    } catch (e) {
      console.log('⚠️ Payment_status column already exists or error:', e.message);
    }
    
    // Add order_items column
    try {
      await db.query('ALTER TABLE reservations ADD COLUMN order_items JSON NULL');
      console.log('✅ Added order_items column');
    } catch (e) {
      console.log('⚠️ Order_items column already exists or error:', e.message);
    }
    
    // Update existing reservations to have 'Pending' status
    try {
      await db.query('UPDATE reservations SET status = "Pending" WHERE status IS NULL');
      console.log('✅ Updated existing reservations status');
    } catch (e) {
      console.log('⚠️ Error updating status:', e.message);
    }
    
    // Verify the changes
    console.log('🔍 Verifying changes...');
    const [columns] = await db.query('DESCRIBE reservations');
    console.log('📊 Updated reservations table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
    console.log('🎉 All columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
  } finally {
    process.exit(0);
  }
}

addColumns();
