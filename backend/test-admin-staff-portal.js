const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testAdminStaffPortal() {
  try {
    console.log('🧪 Testing Admin Staff Portal...\n');

    // Test 1: Get all staff members
    console.log('1. Testing get all staff...');
    try {
      const response = await fetch(`${API_BASE}/staff`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found ${data.data.length} staff members`);
        data.data.forEach(staff => {
          console.log(`   - ${staff.name} (ID: ${staff.staff_id}, Role: ${staff.role})`);
        });
      } else {
        console.log(`❌ Failed to get staff: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Error getting staff:', error.message);
    }

    // Test 2: Get available tables
    console.log('\n2. Testing get available tables...');
    try {
      const response = await fetch(`${API_BASE}/tables`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found ${data.data.length} tables`);
        data.data.forEach(table => {
          console.log(`   - Table ${table.table_number} (Capacity: ${table.capacity}, Status: ${table.status})`);
        });
      } else {
        console.log(`❌ Failed to get tables: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Error getting tables:', error.message);
    }

    // Test 3: Test staff table assignments
    console.log('\n3. Testing staff table assignments...');
    try {
      const response = await fetch(`${API_BASE}/staff/1/tables`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Staff 1 has ${data.assignedTables.length} assigned tables`);
        data.assignedTables.forEach(table => {
          console.log(`   - Table ${table.table_number}`);
        });
      } else {
        console.log(`❌ Failed to get staff tables: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Error getting staff tables:', error.message);
    }

    console.log('\n✅ Admin Staff Portal tests completed!');

  } catch (error) {
    console.error('❌ Error testing admin staff portal:', error);
  }
}

testAdminStaffPortal();
