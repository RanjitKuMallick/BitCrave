const express = require('express');
const app = express();

// Test if adminController can be loaded
console.log('🔍 Testing adminController import...');
try {
  const adminController = require('./controllers/adminController');
  console.log('✅ adminController loaded successfully');
  console.log('Available functions:', Object.keys(adminController));
} catch (error) {
  console.log('❌ Error loading adminController:', error.message);
}

// Test if admin routes can be loaded
console.log('\n🔍 Testing admin routes import...');
try {
  const adminRoutes = require('./routes/admin');
  console.log('✅ admin routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading admin routes:', error.message);
}

// Test if database connection works
console.log('\n🔍 Testing database connection...');
try {
  const db = require('./models/db');
  console.log('✅ Database connection loaded successfully');
} catch (error) {
  console.log('❌ Error loading database:', error.message);
}

// Test middleware
console.log('\n🔍 Testing middleware import...');
try {
  const verifyAdminToken = require('./middleware/verifyAdminToken');
  console.log('✅ verifyAdminToken middleware loaded successfully');
} catch (error) {
  console.log('❌ Error loading middleware:', error.message);
}

console.log('\n🎯 Debug complete!');
