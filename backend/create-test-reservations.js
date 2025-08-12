const db = require('./models/db');

async function createTestReservations() {
  try {
    console.log('Creating test reservations...');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Create test reservations for different tables
    const testReservations = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        date: today,
        time: '12:00',
        people: 2,
        table_number: 'T1', // Assigned to staff 1
        status: 'Confirmed',
        payment_status: 'Pending'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '1234567891',
        date: today,
        time: '13:00',
        people: 4,
        table_number: 'T6', // Assigned to staff 2
        status: 'Confirmed',
        payment_status: 'Pending'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '1234567892',
        date: today,
        time: '14:00',
        people: 6,
        table_number: 'T11', // Assigned to staff 3
        status: 'Confirmed',
        payment_status: 'Pending'
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '1234567893',
        date: tomorrow,
        time: '12:00',
        people: 2,
        table_number: 'T2', // Assigned to staff 1
        status: 'Confirmed',
        payment_status: 'Pending'
      }
    ];

    for (const reservation of testReservations) {
      try {
        await db.query(
          'INSERT INTO reservations (name, email, phone, date, time, people, table_number, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            reservation.name,
            reservation.email,
            reservation.phone,
            reservation.date,
            reservation.time,
            reservation.people,
            reservation.table_number,
            reservation.status,
            reservation.payment_status
          ]
        );
        console.log(`✅ Created reservation for ${reservation.name} at table ${reservation.table_number}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️ Reservation for ${reservation.name} already exists`);
        } else {
          console.error(`❌ Error creating reservation for ${reservation.name}:`, error.message);
        }
      }
    }

    console.log('🎉 Test reservations created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test reservations:', error);
    process.exit(1);
  }
}

createTestReservations();
