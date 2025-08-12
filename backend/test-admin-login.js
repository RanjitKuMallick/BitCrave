const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testCredentials = {
  valid: {
    username: 'admin',
    password: 'admin123'
  },
  invalid: {
    username: 'admin',
    password: 'wrongpassword'
  },
  missing: {
    username: 'admin'
    // missing password
  }
};

// Helper functions
function logResult(testName, success, data, error) {
  console.log(`\n${success ? '✅' : '❌'} ${testName}`);
  if (success) {
    console.log('   Response:', JSON.stringify(data, null, 2));
  } else {
    console.log('   Error:', error);
  }
}

// Test functions
async function testValidAdminLogin() {
  try {
    const response = await axios.post(`${API_BASE}/admin/login`, testCredentials.valid);
    logResult('Valid Admin Login', true, response.data);
    return response.data.token;
  } catch (error) {
    logResult('Valid Admin Login', false, null, error.response?.data || error.message);
    return null;
  }
}

async function testInvalidAdminLogin() {
  try {
    const response = await axios.post(`${API_BASE}/admin/login`, testCredentials.invalid);
    logResult('Invalid Admin Login', true, response.data);
  } catch (error) {
    logResult('Invalid Admin Login', false, null, error.response?.data || error.message);
  }
}

async function testMissingCredentials() {
  try {
    const response = await axios.post(`${API_BASE}/admin/login`, testCredentials.missing);
    logResult('Missing Credentials', true, response.data);
  } catch (error) {
    logResult('Missing Credentials', false, null, error.response?.data || error.message);
  }
}

async function testAdminLogout(token) {
  if (!token) {
    console.log('\n⏭️  Skipping logout test - no valid token');
    return;
  }

  try {
    const response = await axios.post(`${API_BASE}/admin/logout`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    logResult('Admin Logout', true, response.data);
  } catch (error) {
    logResult('Admin Logout', false, null, error.response?.data || error.message);
  }
}

async function testDashboardStats(token) {
  if (!token) {
    console.log('\n⏭️  Skipping dashboard test - no valid token');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE}/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    logResult('Dashboard Stats', true, response.data);
  } catch (error) {
    logResult('Dashboard Stats', false, null, error.response?.data || error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🔐 Testing Admin Authentication System');
  console.log('=====================================');
  
  // Test 1: Valid login
  const token = await testValidAdminLogin();
  
  // Test 2: Invalid login
  await testInvalidAdminLogin();
  
  // Test 3: Missing credentials
  await testMissingCredentials();
  
  // Test 4: Dashboard stats (requires valid token)
  await testDashboardStats(token);
  
  // Test 5: Logout (requires valid token)
  await testAdminLogout(token);
  
  console.log('\n🎯 Test Summary:');
  console.log('================');
  console.log('• Valid login should succeed and return a token');
  console.log('• Invalid login should fail with 401 error');
  console.log('• Missing credentials should fail with 400 error');
  console.log('• Dashboard stats should work with valid token');
  console.log('• Logout should work with valid token');
  
  console.log('\n💡 If tests are failing:');
  console.log('1. Make sure the server is running: npm start');
  console.log('2. Run the setup script: node setup-admin.js');
  console.log('3. Check your database connection');
  console.log('4. Verify the admins table exists and has data');
}

// Run the tests
runTests().catch(console.error);
