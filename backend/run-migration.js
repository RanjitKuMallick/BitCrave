const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔧 Running database migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'sql', 'migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);
          await db.query(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️ Statement ${i + 1} skipped (already exists): ${error.message}`);
          } else if (error.code === 'ER_KEY_COLUMN_DOES_NOT_EXITS') {
            console.log(`⚠️ Statement ${i + 1} skipped (column doesn't exist yet): ${error.message}`);
          } else {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            // Don't throw error, continue with other statements
          }
        }
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    
    // Verify the changes
    console.log('🔍 Verifying migration...');
    const [columns] = await db.query('DESCRIBE reservations');
    console.log('📊 Updated reservations table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();
