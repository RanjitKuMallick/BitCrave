const db = require('./models/db');

async function fixTableNumberColumn() {
  try {
    console.log('Fixing table_number column type...');

    // Change table_number column from INT to VARCHAR(10)
    await db.query('ALTER TABLE reservations MODIFY COLUMN table_number VARCHAR(10)');
    console.log('✅ Changed table_number column to VARCHAR(10)');

    console.log('🎉 Table number column fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing table number column:', error);
    process.exit(1);
  }
}

fixTableNumberColumn();
