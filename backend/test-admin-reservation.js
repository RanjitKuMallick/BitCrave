const fetch = require('node-fetch');

async function testAdminReservation() {
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    console.log('🧪 Testing Admin Reservation Page...');
    
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Admin login failed');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Admin login successful');
    
    // 2. Test reservations API
    console.log('2. Testing reservations API...');
    const reservationsResponse = await fetch(`${API_BASE}/reservations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!reservationsResponse.ok) {
      throw new Error('Reservations API failed');
    }
    
    const reservationsData = await reservationsResponse.json();
    console.log(`✅ Reservations API working - Found ${reservationsData.count} reservations`);
    
    // 3. Test stats API
    console.log('3. Testing stats API...');
    const statsResponse = await fetch(`${API_BASE}/reservations/stats/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!statsResponse.ok) {
      throw new Error('Stats API failed');
    }
    
    const statsData = await statsResponse.json();
    console.log('✅ Stats API working:', statsData.stats);
    
    // 4. Test session API
    console.log('4. Testing session API...');
    const sessionResponse = await fetch(`${API_BASE}/admin/session`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!sessionResponse.ok) {
      throw new Error('Session API failed');
    }
    
    const sessionData = await sessionResponse.json();
    console.log('✅ Session API working:', sessionData.admin.username);
    
    console.log('\n🎉 All admin reservation tests passed!');
    console.log('\n📊 Summary:');
    console.log(`- Total Reservations: ${statsData.stats.total}`);
    console.log(`- Today's Reservations: ${statsData.stats.today}`);
    console.log(`- Pending Reservations: ${statsData.stats.pending}`);
    console.log(`- Confirmed Reservations: ${statsData.stats.confirmed}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminReservation();
