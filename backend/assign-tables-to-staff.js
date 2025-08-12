const db = require('./models/db');

async function assignTablesToStaff() {
  try {
    console.log('Assigning tables to staff...');

    const today = new Date().toISOString().split('T')[0];

    // Assign tables to staff members
    const assignments = [
      { staff_id: 1, table_number: 'T1' },
      { staff_id: 1, table_number: 'T2' },
      { staff_id: 2, table_number: 'T6' },
      { staff_id: 2, table_number: 'T7' },
      { staff_id: 3, table_number: 'T11' },
      { staff_id: 3, table_number: 'T12' }
    ];

    for (const assignment of assignments) {
      try {
        // Get staff internal ID
        const [staff] = await db.query('SELECT id FROM staff WHERE staff_id = ?', [assignment.staff_id]);
        if (staff.length === 0) {
          console.log(`⚠️ Staff ${assignment.staff_id} not found`);
          continue;
        }

        // Assign table
        await db.query(
          'INSERT INTO staff_table_assignments (staff_id, table_number, assigned_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP',
          [staff[0].id, assignment.table_number, today]
        );
        console.log(`✅ Assigned table ${assignment.table_number} to staff ${assignment.staff_id}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️ Table ${assignment.table_number} already assigned to staff ${assignment.staff_id}`);
        } else {
          console.error(`❌ Error assigning table ${assignment.table_number} to staff ${assignment.staff_id}:`, error.message);
        }
      }
    }

    console.log('🎉 Table assignments completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error assigning tables to staff:', error);
    process.exit(1);
  }
}

assignTablesToStaff();
