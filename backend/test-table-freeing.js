const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testTableFreeing() {
  try {
    console.log('🧪 Testing Table Freeing Functionality...\n');

    // Test 1: Check staff reservations before payment
    console.log('1. Checking staff reservations before payment...');
    const beforeResponse = await fetch(`${API_BASE}/staff/1/reservations`);
    const beforeData = await beforeResponse.json();
    console.log('Reservations before payment:', beforeData.data.length);
    console.log('✅ Before payment check completed\n');

    // Test 2: Mark a reservation as paid
    console.log('2. Marking reservation as paid...');
    const reservationId = beforeData.data[0].id;
    const updateResponse = await fetch(`${API_BASE}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: 'Paid' })
    });
    const updateData = await updateResponse.json();
    console.log('Update response:', updateData);
    console.log('✅ Payment update completed\n');

    // Test 3: Check staff reservations after payment
    console.log('3. Checking staff reservations after payment...');
    const afterResponse = await fetch(`${API_BASE}/staff/1/reservations`);
    const afterData = await afterResponse.json();
    console.log('Reservations after payment:', afterData.data.length);
    console.log('✅ After payment check completed\n');

    // Test 4: Verify the paid reservation is no longer visible
    const paidReservation = afterData.data.find(r => r.id === reservationId);
    if (paidReservation) {
      console.log('❌ Paid reservation is still visible to staff');
    } else {
      console.log('✅ Paid reservation is no longer visible to staff (table freed)');
    }

    console.log('🎉 Table freeing test completed!');
  } catch (error) {
    console.error('❌ Error testing table freeing:', error);
  }
}

testTableFreeing();
