# 🍽️ BitCrave Restaurant Management System - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [Backend API Documentation](#backend-api-documentation)
5. [Frontend Documentation](#frontend-documentation)
6. [Authentication System](#authentication-system)
7. [Payment Integration](#payment-integration)
8. [Email Integration](#email-integration)
9. [Setup & Installation](#setup--installation)
10. [API Endpoints](#api-endpoints)
11. [File Structure](#file-structure)
12. [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

**BitCrave** is a comprehensive restaurant management system with the following features:

### ✨ Key Features
- **Multi-Authentication System**: Database, Firebase Email/Password, Google OAuth
- **Table Reservation Management**: Real-time availability, double-booking prevention
- **Menu Management**: Dynamic menu with categories and pricing
- **Staff Management**: Staff portal with table assignments
- **Admin Dashboard**: Complete restaurant management interface
- **Payment Integration**: Razorpay payment gateway
- **Email Notifications**: EmailJS integration for confirmations
- **Gallery & Events**: Content management system
- **Responsive Design**: Mobile-friendly interface

### 🏗️ Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Firebase Auth, JWT
- **Payment**: Razorpay
- **Email**: EmailJS
- **File Upload**: Multer

---

## 🏛️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Public)      │◄──►│   (Node.js)     │◄──►│    (MySQL)      │
│                 │    │                 │    │                 │
│ • User Pages    │    │ • API Routes    │    │ • Users         │
│ • Admin Pages   │    │ • Controllers   │    │ • Reservations  │
│ • Staff Pages   │    │ • Middleware    │    │ • Tables        │
│ • Static Files  │    │ • Models        │    │ • Menu          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  External APIs  │    │   File Storage  │    │   Authentication│
│                 │    │                 │    │                 │
│ • Razorpay      │    │ • Uploads/      │    │ • Firebase      │
│ • EmailJS       │    │ • Images        │    │ • JWT           │
│ • Google OAuth  │    │ • Static Files  │    │ • Session Mgmt  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(20),
    firebase_uid VARCHAR(255) UNIQUE,
    photo_url TEXT,
    auth_type ENUM('database', 'firebase', 'google') DEFAULT 'database',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tables Table
```sql
CREATE TABLE tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status ENUM('available', 'occupied', 'reserved') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    table_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);
```

### Menu Table
```sql
CREATE TABLE menu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Staff Table
```sql
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('waiter', 'manager', 'admin') DEFAULT 'waiter',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Sessions Table
```sql
CREATE TABLE admin_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES staff(id)
);
```

---

## 🔧 Backend API Documentation

### Server Configuration (`backend/server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static file serving
app.use(express.static('../public'));
app.use('/admin', express.static('../admin'));
app.use('/staff', express.static('../staff'));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/events', require('./routes/events'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/tables', require('./routes/tables'));
```

### Database Configuration (`backend/config/db.js`)
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'bitcrave',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
```

---

## 🎨 Frontend Documentation

### Page Structure
```
public/
├── index.html              # Landing page
├── login.html              # User authentication
├── register.html           # User registration
├── reservations.html       # Table reservation system
├── menu.html              # Menu display
├── gallery.html           # Photo gallery
├── about.html             # About page
├── contact.html           # Contact page
├── my-booking.html        # User's reservations
└── payment-success.html   # Payment confirmation

admin/
├── login.html             # Admin login
├── dashboard.html         # Admin dashboard
├── reservation.html       # Reservation management
├── menu.html             # Menu management
├── staff.html            # Staff management
├── gallery.html          # Gallery management
├── event.html            # Event management
├── settings.html         # System settings
└── record.html           # Records & reports

staff/
├── login.html            # Staff login
├── staff-order.html      # Staff order management
└── user.html             # User management
```

### Authentication Flow
```javascript
// Firebase Authentication
const firebaseConfig = {
    apiKey: "AIzaSyDSwE0RsuGc-ttWIyz68pJx68UVv8Wz1Co",
    authDomain: "bitcrave-d6cfe.firebaseapp.com",
    projectId: "bitcrave-d6cfe",
    storageBucket: "bitcrave-d6cfe.appspot.com",
    messagingSenderId: "1009012061578",
    appId: "1:1009012061578:web:a232806c2624faa5680473",
    measurementId: "G-743LM64PC0"
};

// Session Management
sessionStorage.setItem("bitcrave-user", JSON.stringify(userData));
sessionStorage.setItem("bitcrave-token", backendData.token);
sessionStorage.setItem("bitcrave-firebase-token", firebaseToken);
```

---

## 🔐 Authentication System

### Multi-Authentication Support
1. **Database Authentication**
   - Traditional email/password login
   - JWT token generation
   - Session management

2. **Firebase Authentication**
   - Email/password authentication
   - Google OAuth integration
   - Automatic user creation/update

3. **Admin Authentication**
   - Staff login system
   - Role-based access control
   - Session management

### Authentication Flow
```mermaid
graph TD
    A[User Login] --> B{Authentication Type}
    B -->|Database| C[Email/Password]
    B -->|Firebase| D[Firebase Auth]
    B -->|Google| E[Google OAuth]
    
    C --> F[Verify Password]
    D --> G[Firebase Verification]
    E --> H[Google Verification]
    
    F --> I[Generate JWT]
    G --> I
    H --> I
    
    I --> J[Save Session]
    J --> K[Redirect to Dashboard]
```

---

## 💳 Payment Integration

### Razorpay Configuration
```javascript
// Payment configuration
const options = {
    key: "rzp_test_Hog4lqhvyUVYdA", // Test key
    amount: total * 100, // Amount in paise
    currency: "INR",
    name: "BitCrave",
    description: "Table Booking Payment",
    handler: function (response) {
        // Handle payment success
        localStorage.setItem('paymentStatus', 'success');
        localStorage.setItem('paymentId', response.razorpay_payment_id);
        window.location.href = 'payment-success.html';
    },
    prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.phone
    },
    theme: { color: "#3399cc" }
};
```

### Payment Flow
1. User selects table and menu items
2. System calculates total amount
3. Razorpay payment gateway opens
4. User completes payment
5. Payment confirmation and reservation creation
6. Email notification sent

---

## 📧 Email Integration

### EmailJS Configuration
```javascript
// EmailJS setup
const templateParams = {
    to_name: reservation.name,
    to_email: reservation.email,
    reservation_date: reservation.date,
    reservation_time: reservation.time,
    table_number: reservation.table_number,
    guests: reservation.guests,
    total_amount: reservation.total_amount
};

// Send confirmation email
const response = await emailjs.send(
    'service_xj1e9a6', // EmailJS service ID
    'template_5sn3aqi', // EmailJS template ID
    templateParams
);
```

### Email Templates
- **Reservation Confirmation**: Booking details and payment confirmation
- **Admin Notifications**: New reservation alerts
- **Staff Assignments**: Table assignment notifications

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Environment Variables (`.env`)
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bitcrave
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Installation Steps
```bash
# 1. Clone the repository
git clone <repository-url>
cd bitcrave-restaurant

# 2. Install backend dependencies
cd backend
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Set up database
mysql -u root -p
CREATE DATABASE bitcrave;
USE bitcrave;
SOURCE sql/schema.sql;

# 5. Run database migrations
node add-firebase-fields.js
node add-staff-tables.js
node add-sample-menu.js

# 6. Start the server
node server.js
```

### Database Setup Scripts
```bash
# Add Firebase fields
node add-firebase-fields.js

# Add staff tables
node add-staff-tables.js

# Add sample menu items
node add-sample-menu.js

# Create test reservations
node create-test-reservations.js
```

---

## 📡 API Endpoints

### User Authentication
```
POST /api/users/register          # User registration
POST /api/users/login             # Database login
POST /api/users/firebase-login    # Firebase authentication
POST /api/users/logout            # User logout
```

### Reservations
```
GET    /api/reservations                    # Get all reservations (admin)
POST   /api/reservations                    # Create new reservation
GET    /api/reservations/user               # Get user's reservations
GET    /api/reservations/availability       # Check table availability
GET    /api/reservations/tables/available   # Get available tables
PUT    /api/reservations/:id                # Update reservation
DELETE /api/reservations/:id                # Cancel reservation
```

### Menu Management
```
GET    /api/menu                   # Get all menu items
POST   /api/menu                   # Add menu item (admin)
PUT    /api/menu/:id               # Update menu item (admin)
DELETE /api/menu/:id               # Delete menu item (admin)
```

### Staff Management
```
POST   /api/staff/login            # Staff login
GET    /api/staff/profile          # Get staff profile
PUT    /api/staff/profile          # Update staff profile
GET    /api/staff/tables           # Get assigned tables
```

### Admin Management
```
POST   /api/admin/login            # Admin login
GET    /api/admin/dashboard        # Admin dashboard data
GET    /api/admin/reservations     # All reservations
PUT    /api/admin/reservations/:id # Update reservation
DELETE /api/admin/reservations/:id # Delete reservation
```

---

## 📁 File Structure

```
bitcrave-restaurant/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── adminController.js    # Admin logic
│   │   ├── userController.js     # User authentication
│   │   ├── reservationController.js # Reservation management
│   │   ├── menuController.js     # Menu management
│   │   ├── staffController.js    # Staff management
│   │   ├── galleryController.js  # Gallery management
│   │   └── eventController.js    # Event management
│   ├── middleware/
│   │   ├── verifyAdminToken.js   # Admin authentication
│   │   ├── verifyFirebaseToken.js # Firebase verification
│   │   ├── checkBlacklistedToken.js # Token validation
│   │   └── upload.js             # File upload handling
│   ├── models/
│   │   └── db.js                 # Database models
│   ├── routes/
│   │   ├── admin.js              # Admin routes
│   │   ├── users.js              # User routes
│   │   ├── reservations.js       # Reservation routes
│   │   ├── menu.js               # Menu routes
│   │   ├── staff.js              # Staff routes
│   │   ├── gallery.js            # Gallery routes
│   │   ├── events.js             # Event routes
│   │   └── tables.js             # Table routes
│   ├── sql/
│   │   ├── schema.sql            # Database schema
│   │   ├── migration.sql         # Database migrations
│   │   └── admin-sessions-migration.sql # Admin sessions
│   ├── uploads/                  # File uploads
│   ├── utils/
│   │   └── logoutUtils.js        # Logout utilities
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Main server file
│   └── .env                      # Environment variables
├── public/                       # Public frontend
│   ├── index.html               # Landing page
│   ├── login.html               # User login
│   ├── register.html            # User registration
│   ├── reservations.html        # Reservation system
│   ├── menu.html                # Menu display
│   ├── gallery.html             # Gallery
│   ├── about.html               # About page
│   ├── contact.html             # Contact page
│   ├── my-booking.html          # User bookings
│   ├── payment-success.html     # Payment confirmation
│   └── test-redirect.html       # Authentication test
├── admin/                       # Admin frontend
│   ├── login.html               # Admin login
│   ├── dashboard.html           # Admin dashboard
│   ├── reservation.html         # Reservation management
│   ├── menu.html                # Menu management
│   ├── staff.html               # Staff management
│   ├── gallery.html             # Gallery management
│   ├── event.html               # Event management
│   ├── settings.html            # Settings
│   └── record.html              # Records
├── staff/                       # Staff frontend
│   ├── login.html               # Staff login
│   ├── staff-order.html         # Order management
│   └── user.html                # User management
├── src/                         # Source files
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   └── js/
│       └── script.js            # Main JavaScript
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

---

## 🌐 Deployment Guide

### Local Development
```bash
# Start MySQL service
net start MYSQL80

# Start backend server
cd backend
node server.js

# Access the application
# Frontend: http://localhost:5000
# Admin: http://localhost:5000/admin
# Staff: http://localhost:5000/staff
```

### Production Deployment
1. **Server Setup**
   - Set up a VPS with Node.js and MySQL
   - Configure environment variables
   - Set up SSL certificates

2. **Database Setup**
   - Create production database
   - Run migration scripts
   - Set up database backups

3. **Application Deployment**
   - Upload code to server
   - Install dependencies
   - Configure PM2 for process management
   - Set up Nginx reverse proxy

4. **Domain Configuration**
   - Point domain to server IP
   - Configure DNS settings
   - Set up SSL certificates

### Environment Configuration
```bash
# Production .env
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=bitcrave_production
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
PORT=5000
```

---

## 🔧 Configuration Files

### Package.json Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2"
  }
}
```

### Firebase Configuration
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDSwE0RsuGc-ttWIyz68pJx68UVv8Wz1Co",
    authDomain: "bitcrave-d6cfe.firebaseapp.com",
    projectId: "bitcrave-d6cfe",
    storageBucket: "bitcrave-d6cfe.appspot.com",
    messagingSenderId: "1009012061578",
    appId: "1:1009012061578:web:a232806c2624faa5680473",
    measurementId: "G-743LM64PC0"
};
```

---

## 📊 System Features

### User Features
- ✅ Multi-authentication (Database, Firebase, Google)
- ✅ Table reservation with real-time availability
- ✅ Menu browsing and ordering
- ✅ Payment processing (Razorpay)
- ✅ Reservation history
- ✅ Email notifications

### Admin Features
- ✅ Complete reservation management
- ✅ Menu management
- ✅ Staff management
- ✅ Gallery and event management
- ✅ Analytics and reporting
- ✅ System settings

### Staff Features
- ✅ Table assignment management
- ✅ Order processing
- ✅ User management
- ✅ Real-time updates

### Technical Features
- ✅ Responsive design
- ✅ Real-time availability checking
- ✅ Double-booking prevention
- ✅ Session management
- ✅ File upload system
- ✅ Email integration
- ✅ Payment gateway integration

---

## 🛠️ Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   ```bash
   # Start MySQL service
   net start MYSQL80
   ```

2. **Port Already in Use**
   ```bash
   # Kill existing Node processes
   taskkill /F /IM node.exe
   ```

3. **Firebase Authentication Issues**
   - Check Firebase configuration
   - Verify domain in Firebase console
   - Check browser console for errors

4. **Payment Gateway Issues**
   - Verify Razorpay test keys
   - Check payment callback URLs
   - Monitor payment logs

### Debug Commands
```bash
# Check server status
netstat -ano | findstr :5000

# Test API endpoints
curl -X POST http://localhost:5000/api/users/firebase-login

# Check database connection
node test-db.js

# Monitor server logs
node server.js
```

---

## 📞 Support & Contact

For technical support or questions about the BitCrave Restaurant Management System:

- **Documentation**: This file contains complete system documentation
- **API Testing**: Use the test endpoints provided
- **Database**: Check migration scripts for setup
- **Authentication**: Verify Firebase and JWT configurations

---

## 📝 License

This project is developed for educational and commercial use. All rights reserved.

---

*Last Updated: August 2025*
*Version: 1.0.0*
*Developer: BitCrave Team*
