const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAdminLogin() {
  console.log('🔐 Testing Admin Login...');
  console.log('========================');
  
  try {
    // Test valid login
    console.log('\n1. Testing valid admin login...');
    const response = await makeRequest('POST', '/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    if (response.status === 200) {
      console.log('✅ Login successful!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return response.data.token;
    } else {
      console.log('❌ Login failed!');
      console.log('Status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testInvalidLogin() {
  console.log('\n2. Testing invalid admin login...');
  try {
    const response = await makeRequest('POST', '/admin/login', {
      username: 'admin',
      password: 'wrongpassword'
    });
    
    if (response.status === 401) {
      console.log('✅ Invalid login correctly rejected!');
    } else {
      console.log('❌ Unexpected response for invalid login');
      console.log('Status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testMissingCredentials() {
  console.log('\n3. Testing missing credentials...');
  try {
    const response = await makeRequest('POST', '/admin/login', {
      username: 'admin'
      // missing password
    });
    
    if (response.status === 400) {
      console.log('✅ Missing credentials correctly rejected!');
    } else {
      console.log('❌ Unexpected response for missing credentials');
      console.log('Status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Admin Login Tests...\n');
  
  await testAdminLogin();
  await testInvalidLogin();
  await testMissingCredentials();
  
  console.log('\n🎯 Test Summary:');
  console.log('================');
  console.log('• Valid login should return 200 with token');
  console.log('• Invalid login should return 401');
  console.log('• Missing credentials should return 400');
  
  console.log('\n💡 If tests are failing:');
  console.log('1. Make sure the server is running on port 5000');
  console.log('2. Check if the admin user exists in database');
  console.log('3. Verify the API routes are properly configured');
}

runTests().catch(console.error);
