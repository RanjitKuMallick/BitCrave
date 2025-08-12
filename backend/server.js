const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from public directory
app.use(express.static('../public'));

// ✅ Serve admin directory
app.use('/admin', express.static('../admin'));

// ✅ Serve staff directory
app.use('/staff', express.static('../staff'));

// ✅ Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Serve index.html as the main page (must be before API routes)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/events', require('./routes/events'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/tables', require('./routes/tables'));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'API endpoint not found',
    method: req.method,
    url: req.originalUrl
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log('📋 Available API routes:');
  console.log('  - POST /api/users/register');
  console.log('  - POST /api/users/login');
  console.log('  - POST /api/users/firebase-login');
  console.log('  - POST /api/users/logout');
});
