const staffController = require('./controllers/staffController');

async function testStaffController() {
  try {
    console.log('🧪 Testing Staff Controller directly...\n');

    // Test 1: Test staff login function
    console.log('1. Testing staff login function...');
    
    // Mock request and response objects
    const mockReq = {
      body: { staff_id: 1, password: '1' }
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
          return mockRes;
        }
      }),
      json: (data) => {
        console.log('Response:', data);
        return mockRes;
      }
    };

    await staffController.staffLogin(mockReq, mockRes);
    console.log('✅ Staff login test completed\n');

  } catch (error) {
    console.error('❌ Error testing staff controller:', error);
  }
}

testStaffController();
