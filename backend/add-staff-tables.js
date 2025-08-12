const db = require('./models/db');

async function addStaffTables() {
  try {
    console.log('Adding staff tables...');

    // Create staff table
    await db.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        staff_id INT NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Staff table created');

    // Check if staff_id column exists
    const [columns] = await db.query("SHOW COLUMNS FROM staff LIKE 'staff_id'");
    if (columns.length === 0) {
      // Add staff_id column without unique constraint first
      await db.query('ALTER TABLE staff ADD COLUMN staff_id INT AFTER id');
      console.log('✅ Added staff_id column');
      
      // Update existing records with staff_id values
      await db.query('UPDATE staff SET staff_id = id WHERE staff_id IS NULL');
      console.log('✅ Updated existing staff records with staff_id');
      
      // Now add unique constraint
      await db.query('ALTER TABLE staff MODIFY COLUMN staff_id INT NOT NULL UNIQUE');
      console.log('✅ Added unique constraint to staff_id');
    } else {
      console.log('⚠️ staff_id column already exists');
    }

    // Create staff table assignments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS staff_table_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        staff_id INT NOT NULL,
        table_number VARCHAR(10) NOT NULL,
        assigned_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
        UNIQUE KEY unique_staff_table_date (staff_id, table_number, assigned_date)
      )
    `);
    console.log('✅ Staff table assignments table created');

    // Insert demo staff members
    await db.query(`
      INSERT IGNORE INTO staff (staff_id, name, email, phone) VALUES
      (1, 'John Smith', 'john@bitcrave.com', '1234567890'),
      (2, 'Sarah Johnson', 'sarah@bitcrave.com', '1234567891'),
      (3, 'Mike Wilson', 'mike@bitcrave.com', '1234567892')
    `);
    console.log('✅ Demo staff members inserted');

    console.log('🎉 Staff tables migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding staff tables:', error);
    process.exit(1);
  }
}

addStaffTables();
