// test-apis.js - Comprehensive API testing script
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testAPIs() {
  console.log('🧪 Testing Register, Login, and Logout APIs...\n');

  let userToken = null;
  let adminToken = null;

  // Test 1: User Registration
  console.log('1. Testing User Registration:');
  try {
    const registerData = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '1234567890',
      password: 'testpassword123'
    };

    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', data);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  // Test 2: User Login
  console.log('\n2. Testing User Login:');
  try {
    const loginData = {
      email: 'testuser@example.com',
      password: 'testpassword123'
    };

    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', data);
    
    if (data.token) {
      userToken = data.token;
      console.log('   ✅ User token received');
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }

  // Test 3: Admin Login
  console.log('\n3. Testing Admin Login:');
  try {
    const adminLoginData = {
      username: 'admin',
      password: 'admin123'
    };

    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminLoginData)
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', data);
    
    if (data.token) {
      adminToken = data.token;
      console.log('   ✅ Admin token received');
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }

  // Test 4: User Logout (with token)
  console.log('\n4. Testing User Logout (with token):');
  if (userToken) {
    try {
      const response = await fetch(`${API_BASE}/users/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      const data = await response.json();
      console.log('   Status:', response.status);
      console.log('   Response:', data);
    } catch (error) {
      console.log('   Error:', error.message);
    }
  } else {
    console.log('   ⚠️  No user token available for logout test');
  }

  // Test 5: Admin Logout (with token)
  console.log('\n5. Testing Admin Logout (with token):');
  if (adminToken) {
    try {
      const response = await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const data = await response.json();
      console.log('   Status:', response.status);
      console.log('   Response:', data);
    } catch (error) {
      console.log('   Error:', error.message);
    }
  } else {
    console.log('   ⚠️  No admin token available for logout test');
  }

  // Test 6: User Logout (without token)
  console.log('\n6. Testing User Logout (without token):');
  try {
    const response = await fetch(`${API_BASE}/users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', data);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  // Test 7: Admin Logout (without token)
  console.log('\n7. Testing Admin Logout (without token):');
  try {
    const response = await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', data);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  // Test 8: User Logout (with invalid token)
  console.log('\n8. Testing User Logout (with invalid token):');
  try {
    const response = await fetch(`${API_BASE}/users/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_token_here'
      }
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', data);
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n✅ API testing completed!');
  console.log('\n📝 Summary:');
  console.log('- Registration: Should return 201 for new users, 400 for existing');
  console.log('- Login: Should return 200 with token for valid credentials');
  console.log('- Logout: Should return 200 for valid tokens, 401 for invalid/missing');
}

testAPIs();
