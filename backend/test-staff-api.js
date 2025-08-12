const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testStaffAPI() {
  try {
    console.log('🧪 Testing Staff API endpoints...\n');

    // Test 1: Staff login
    console.log('1. Testing staff login...');
    const loginResponse = await fetch(`${API_BASE}/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: 1, password: '1' })
    });
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    console.log('✅ Staff login test completed\n');

    // Test 2: Get staff's assigned tables
    console.log('2. Testing get staff assigned tables...');
    const tablesResponse = await fetch(`${API_BASE}/staff/1/tables`);
    const tablesData = await tablesResponse.json();
    console.log('Assigned tables response:', tablesData);
    console.log('✅ Get assigned tables test completed\n');

    // Test 3: Get staff's reservations
    console.log('3. Testing get staff reservations...');
    const reservationsResponse = await fetch(`${API_BASE}/staff/1/reservations`);
    const reservationsData = await reservationsResponse.json();
    console.log('Staff reservations response:', reservationsData);
    console.log('✅ Get staff reservations test completed\n');

    // Test 4: Get all staff members
    console.log('4. Testing get all staff...');
    const allStaffResponse = await fetch(`${API_BASE}/staff`);
    const allStaffData = await allStaffResponse.json();
    console.log('All staff response:', allStaffData);
    console.log('✅ Get all staff test completed\n');

    console.log('🎉 All staff API tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing staff API:', error);
  }
}

testStaffAPI();
