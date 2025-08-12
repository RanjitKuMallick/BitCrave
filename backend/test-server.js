const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 5001; // Use different port to avoid conflicts

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import admin routes
const adminRoutes = require('./routes/admin');

// Mount admin routes
app.use('/api/admin', adminRoutes);

// Test route
app.get("/", (req, res) => res.send("Test server is working!"));

// Start server
app.listen(port, () => {
  console.log(`✅ Test server running at http://localhost:${port}`);
  console.log('🔗 Admin login endpoint: http://localhost:5001/api/admin/login');
  console.log('📝 Test with: POST /api/admin/login with {"username":"admin","password":"admin123"}');
});

// Test the route after 2 seconds
setTimeout(async () => {
  const http = require('http');
  
  const postData = JSON.stringify({
    username: 'admin',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('\n🧪 Testing admin login...');
      console.log('Status:', res.statusCode);
      console.log('Response:', body);
      
      if (res.statusCode === 200) {
        console.log('✅ Admin login route is working!');
      } else {
        console.log('❌ Admin login route is not working properly');
      }
      
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}, 2000);
