const mysql = require('mysql2/promise');
const db = require('./config/db');

async function applySchema() {
    try {
        console.log('Applying database schema changes...');

        // Create tables table
        await db.query(`
            CREATE TABLE IF NOT EXISTS tables (
                id INT PRIMARY KEY AUTO_INCREMENT,
                table_number VARCHAR(10) UNIQUE NOT NULL,
                capacity INT NOT NULL,
                location VARCHAR(50),
                status ENUM('available', 'maintenance') DEFAULT 'available'
            )
        `);
        console.log('✅ Tables table created/verified');

        // Insert default tables
        const tables = [
            ['T1', 2, 'Window'],
            ['T2', 2, 'Window'],
            ['T3', 1, 'Counter'],
            ['T4', 2, 'Balcony'],
            ['T5', 1, 'Counter'],
            ['T6', 4, 'Center'],
            ['T7', 3, 'Center'],
            ['T8', 4, 'Patio'],
            ['T9', 2, 'Corner'],
            ['T10', 4, 'Garden'],
            ['T11', 6, 'Private Room'],
            ['T12', 8, 'Main Hall'],
            ['T13', 6, 'Terrace'],
            ['T14', 10, 'Banquet'],
            ['T15', 12, 'VIP Section']
        ];

        for (const [tableNumber, capacity, location] of tables) {
            await db.query(
                'INSERT IGNORE INTO tables (table_number, capacity, location) VALUES (?, ?, ?)',
                [tableNumber, capacity, location]
            );
        }
        console.log('✅ Default tables inserted');

        // Add new columns to reservations table
        try {
            await db.query('ALTER TABLE reservations ADD COLUMN table_id INT');
            console.log('✅ Added table_id column');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ table_id column already exists');
            } else {
                throw error;
            }
        }

        try {
            await db.query('ALTER TABLE reservations ADD COLUMN slot_number INT DEFAULT 1');
            console.log('✅ Added slot_number column');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ slot_number column already exists');
            } else {
                throw error;
            }
        }

        // Add foreign key constraint
        try {
            await db.query('ALTER TABLE reservations ADD FOREIGN KEY (table_id) REFERENCES tables(id)');
            console.log('✅ Added foreign key constraint');
        } catch (error) {
            if (error.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️ Foreign key constraint already exists');
            } else {
                console.log('⚠️ Could not add foreign key constraint:', error.message);
            }
        }

        console.log('✅ Schema changes applied successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error applying schema:', error);
        process.exit(1);
    }
}

applySchema();
