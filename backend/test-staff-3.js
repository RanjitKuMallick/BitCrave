const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testStaff3() {
  try {
    console.log('🧪 Testing Staff 3 (Mike Wilson)...\n');

    // Test staff 3 reservations
    console.log('Testing get staff 3 reservations...');
    const reservationsResponse = await fetch(`${API_BASE}/staff/3/reservations`);
    const reservationsData = await reservationsResponse.json();
    console.log('Staff 3 reservations response:', reservationsData);
    console.log('✅ Staff 3 test completed\n');

  } catch (error) {
    console.error('❌ Error testing staff 3:', error);
  }
}

testStaff3();
