// test-logout.js - Simple test script for logout API
const fetch = require('node-fetch');

async function testLogoutAPI() {
  console.log('🧪 Testing Logout API...\n');

  // Test 1: User logout without token (should work gracefully)
  console.log('1. Testing user logout without token:');
  try {
    const response = await fetch('http://localhost:5000/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('   Response:', data);
    console.log('   Status:', response.status);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n2. Testing admin logout without token:');
  try {
    const response = await fetch('http://localhost:5000/api/admin/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('   Response:', data);
    console.log('   Status:', response.status);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  // Test 3: User logout with invalid token
  console.log('\n3. Testing user logout with invalid token:');
  try {
    const response = await fetch('http://localhost:5000/api/users/logout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_token_here'
      }
    });
    const data = await response.json();
    console.log('   Response:', data);
    console.log('   Status:', response.status);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n✅ Logout API tests completed!');
  console.log('\n📝 Notes:');
  console.log('- The logout API should return 401 for missing/invalid tokens');
  console.log('- This is expected behavior for security');
  console.log('- When you login and get a valid token, logout will work properly');
}

testLogoutAPI();
