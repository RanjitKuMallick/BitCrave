const fetch = require('node-fetch');

async function testFirebaseEndpoint() {
  try {
    console.log('🧪 Testing Firebase login endpoint...');
    
    const testData = {
      firebase_uid: 'test_uid_123',
      email: 'test@example.com',
      name: 'Test User',
      phone: '1234567890',
      photo_url: 'https://example.com/photo.jpg'
    };

    const response = await fetch('http://localhost:5000/api/users/firebase-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('📊 Response body:', text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Firebase endpoint working!');
      console.log('📋 Response data:', data);
    } else {
      console.log('❌ Firebase endpoint failed!');
      console.log('📋 Error response:', text);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFirebaseEndpoint();
