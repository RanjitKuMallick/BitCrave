const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/reservations';

// Test data
const testReservation = {
  name: "Test User",
  email: "test@example.com",
  phone: "+1234567890",
  date: "2024-12-25",
  time: "19:30",
  guests: 4,
  message: "Test reservation"
};

// Helper function to log results
const logResult = (testName, result) => {
  console.log(`\n✅ ${testName}:`);
  console.log('Status:', result.status);
  console.log('Data:', JSON.stringify(result.data, null, 2));
};

const logError = (testName, error) => {
  console.log(`\n❌ ${testName}:`);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Error:', error.response.data);
  } else {
    console.log('Error:', error.message);
  }
};

// Test functions
const testCreateReservation = async () => {
  try {
    const result = await axios.post(BASE_URL, testReservation);
    logResult('Create Reservation', result);
    return result.data.reservationId;
  } catch (error) {
    logError('Create Reservation', error);
    return null;
  }
};

const testCheckAvailability = async () => {
  try {
    const result = await axios.get(`${BASE_URL}/availability?date=2024-12-25&time=19:30`);
    logResult('Check Availability', result);
  } catch (error) {
    logError('Check Availability', error);
  }
};

const testGetReservationById = async (id) => {
  if (!id) return;
  
  try {
    const result = await axios.get(`${BASE_URL}/${id}`);
    logResult('Get Reservation by ID', result);
  } catch (error) {
    logError('Get Reservation by ID', error);
  }
};

const testInvalidReservation = async () => {
  const invalidReservation = {
    name: "Test User",
    // Missing required fields
    date: "2024-12-25",
    time: "25:00", // Invalid time
    guests: 25 // Too many guests
  };

  try {
    const result = await axios.post(BASE_URL, invalidReservation);
    logResult('Invalid Reservation (should fail)', result);
  } catch (error) {
    logError('Invalid Reservation (expected to fail)', error);
  }
};

const testPastDateReservation = async () => {
  const pastReservation = {
    ...testReservation,
    date: "2020-01-01" // Past date
  };

  try {
    const result = await axios.post(BASE_URL, pastReservation);
    logResult('Past Date Reservation (should fail)', result);
  } catch (error) {
    logError('Past Date Reservation (expected to fail)', error);
  }
};

const testOutsideBusinessHours = async () => {
  const outsideHoursReservation = {
    ...testReservation,
    time: "08:00" // Before business hours
  };

  try {
    const result = await axios.post(BASE_URL, outsideHoursReservation);
    logResult('Outside Business Hours (should fail)', result);
  } catch (error) {
    logError('Outside Business Hours (expected to fail)', error);
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting Reservation API Tests...\n');
  
  // Test 1: Check availability
  await testCheckAvailability();
  
  // Test 2: Create a valid reservation
  const reservationId = await testCreateReservation();
  
  // Test 3: Get reservation by ID
  await testGetReservationById(reservationId);
  
  // Test 4: Test validation - invalid reservation
  await testInvalidReservation();
  
  // Test 5: Test validation - past date
  await testPastDateReservation();
  
  // Test 6: Test validation - outside business hours
  await testOutsideBusinessHours();
  
  console.log('\n🎉 All tests completed!');
  console.log('\nNote: Admin endpoints (GET all, UPDATE, DELETE) require authentication and are not tested here.');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testCreateReservation,
  testCheckAvailability,
  testGetReservationById,
  testInvalidReservation,
  testPastDateReservation,
  testOutsideBusinessHours
};
