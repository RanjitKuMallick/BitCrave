const db = require('./models/db');

async function checkReservations() {
  try {
    console.log('Checking all reservations in database...\n');

    // Get all reservations
    const [reservations] = await db.query('SELECT * FROM reservations ORDER BY created_at DESC');
    console.log(`Total reservations: ${reservations.length}\n`);

    if (reservations.length > 0) {
      console.log('Recent reservations:');
      reservations.slice(0, 10).forEach((r, index) => {
        console.log(`${index + 1}. ID: ${r.id}, Name: ${r.name}, Table: ${r.table_number}, Status: ${r.status}, Payment: ${r.payment_status}, Date: ${r.date}, Time: ${r.time}`);
      });
    } else {
      console.log('No reservations found in database');
    }

    // Check staff table assignments
    console.log('\n--- Staff Table Assignments ---');
    const [assignments] = await db.query(`
      SELECT sta.*, s.name as staff_name 
      FROM staff_table_assignments sta 
      JOIN staff s ON sta.staff_id = s.id 
      ORDER BY sta.assigned_date DESC
    `);
    
    console.log(`Total assignments: ${assignments.length}`);
    assignments.forEach(a => {
      console.log(`Staff: ${a.staff_name}, Table: ${a.table_number}, Date: ${a.assigned_date}`);
    });

    // Check confirmed reservations for today
    const today = new Date().toISOString().split('T')[0];
    console.log(`\n--- Confirmed Reservations for Today (${today}) ---`);
    const [todayReservations] = await db.query(
      'SELECT * FROM reservations WHERE date = ? AND status = "Confirmed" ORDER BY time',
      [today]
    );
    
    console.log(`Today's confirmed reservations: ${todayReservations.length}`);
    todayReservations.forEach(r => {
      console.log(`- ${r.name} at Table ${r.table_number}, Time: ${r.time}, Payment: ${r.payment_status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking reservations:', error);
    process.exit(1);
  }
}

checkReservations();
