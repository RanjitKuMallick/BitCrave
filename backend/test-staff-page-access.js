const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testStaffPageAccess() {
  try {
    console.log('🧪 Testing Staff Page Access...\n');

    // Test 1: Check if the server is responding
    console.log('1. Testing server response...');
    try {
      const response = await fetch(`${API_BASE}/menu`);
      if (response.ok) {
        console.log('✅ Server is responding correctly');
      } else {
        console.log(`❌ Server error: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Cannot connect to server:', error.message);
      return;
    }

    // Test 2: Test staff login endpoint
    console.log('\n2. Testing staff login endpoint...');
    try {
      const loginResponse = await fetch(`${API_BASE}/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: 1, password: '1' })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Staff login endpoint working');
        console.log(`   Staff: ${loginData.staff.name} (ID: ${loginData.staff.staff_id})`);
      } else {
        console.log(`❌ Staff login failed: ${loginResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Staff login error:', error.message);
    }

    // Test 3: Test staff reservations endpoint
    console.log('\n3. Testing staff reservations endpoint...');
    try {
      const reservationsResponse = await fetch(`${API_BASE}/staff/1/reservations`);
      
      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        console.log('✅ Staff reservations endpoint working');
        console.log(`   Found ${reservationsData.count} reservations`);
        console.log(`   Assigned tables: ${reservationsData.assignedTables.join(', ')}`);
      } else {
        console.log(`❌ Staff reservations failed: ${reservationsResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Staff reservations error:', error.message);
    }

    // Test 4: Test menu endpoint
    console.log('\n4. Testing menu endpoint...');
    try {
      const menuResponse = await fetch(`${API_BASE}/menu`);
      
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        console.log('✅ Menu endpoint working');
        console.log(`   Found ${menuData.menu ? menuData.menu.length : 0} menu items`);
      } else {
        console.log(`❌ Menu endpoint failed: ${menuResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Menu endpoint error:', error.message);
    }

    console.log('\n🎉 All endpoints tested successfully!');
    console.log('\n📋 Instructions for testing staff order page:');
    console.log('1. Open staff/login.html in your browser');
    console.log('2. Login with Staff ID: 1, Password: 1');
    console.log('3. You should be redirected to staff-order.html');
    console.log('4. Check the browser console for any JavaScript errors');
    console.log('5. The page should show reservations for tables T1 and T2');

  } catch (error) {
    console.error('❌ Error testing staff page access:', error);
  }
}

testStaffPageAccess();
