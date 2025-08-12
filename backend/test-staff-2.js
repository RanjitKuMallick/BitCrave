const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testStaff2() {
  try {
    console.log('🧪 Testing Staff 2 (Sarah Johnson)...\n');

    // Test staff 2 reservations
    console.log('Testing get staff 2 reservations...');
    const reservationsResponse = await fetch(`${API_BASE}/staff/2/reservations`);
    const reservationsData = await reservationsResponse.json();
    console.log('Staff 2 reservations response:', reservationsData);
    console.log('✅ Staff 2 test completed\n');

  } catch (error) {
    console.error('❌ Error testing staff 2:', error);
  }
}

testStaff2();
