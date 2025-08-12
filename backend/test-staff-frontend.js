const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testStaffFrontend() {
  try {
    console.log('🧪 Testing Staff Frontend Simulation...\n');

    // Simulate staff login (staff ID 1)
    const staffId = 1;
    const staffName = 'John Smith';

    console.log(`Simulating login for ${staffName} (ID: ${staffId})...\n`);

    // Test 1: Get staff reservations
    console.log('1. Fetching staff reservations...');
    const reservationsResponse = await fetch(`${API_BASE}/staff/${staffId}/reservations`);
    const reservationsData = await reservationsResponse.json();
    
    if (reservationsData.success) {
      console.log(`✅ Found ${reservationsData.count} reservations`);
      console.log(`✅ Assigned tables: ${reservationsData.assignedTables.join(', ')}`);
      
      if (reservationsData.data.length > 0) {
        console.log('\nReservations:');
        reservationsData.data.forEach((r, index) => {
          console.log(`${index + 1}. ${r.name} - Table ${r.table_number} - ${r.date} ${r.time} - ${r.people} people`);
        });
      } else {
        console.log('⚠️ No reservations found');
      }
    } else {
      console.log('❌ Failed to fetch reservations');
    }

    // Test 2: Get menu items
    console.log('\n2. Fetching menu items...');
    const menuResponse = await fetch(`${API_BASE}/menu`);
    const menuData = await menuResponse.json();
    
    if (menuData.menu && menuData.menu.length > 0) {
      console.log(`✅ Found ${menuData.menu.length} menu items`);
    } else {
      console.log('⚠️ No menu items found');
    }

    console.log('\n🎉 Staff frontend simulation completed!');
    console.log('\n📋 Summary:');
    console.log(`- Staff: ${staffName} (ID: ${staffId})`);
    console.log(`- Assigned Tables: ${reservationsData.assignedTables.join(', ')}`);
    console.log(`- Reservations: ${reservationsData.count}`);
    console.log(`- Menu Items: ${menuData.menu ? menuData.menu.length : 0}`);

  } catch (error) {
    console.error('❌ Error testing staff frontend:', error);
  }
}

testStaffFrontend();
