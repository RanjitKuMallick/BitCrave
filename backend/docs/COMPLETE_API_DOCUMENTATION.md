# BitCrave Restaurant Management System - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
- **User endpoints**: Require Firebase authentication or email/password
- **Admin endpoints**: Require admin token in Authorization header
  ```
  Authorization: Bearer <admin_token>
  ```

---

## 🔐 Authentication APIs

### User Authentication

#### 1. User Login
**POST** `/api/users/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890"
  }
}
```

#### 2. User Logout
**POST** `/api/users/logout`
**Headers:** `Authorization: Bearer <user_token>`

### Admin Authentication

#### 1. Admin Login
**POST** `/api/admin/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### 2. Admin Logout
**POST** `/api/admin/logout`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 📅 Reservation APIs

### Public Endpoints

#### 1. Create Reservation
**POST** `/api/reservations`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2024-12-25",
  "time": "19:30",
  "guests": 4,
  "message": "Window seat preferred"
}
```

#### 2. Check Availability
**GET** `/api/reservations/availability?date=2024-12-25&time=19:30`

#### 3. Get Reservation by ID
**GET** `/api/reservations/:id`

### Admin Endpoints

#### 4. Get All Reservations
**GET** `/api/reservations`
**Headers:** `Authorization: Bearer <admin_token>`

#### 5. Get Today's Reservations
**GET** `/api/reservations/today/list`
**Headers:** `Authorization: Bearer <admin_token>`

#### 6. Get Reservations by Date Range
**GET** `/api/reservations/range/search?startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer <admin_token>`

#### 7. Update Reservation
**PUT** `/api/reservations/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 8. Delete Reservation
**DELETE** `/api/reservations/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 9. Get Reservation Statistics
**GET** `/api/reservations/stats/overview`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 🍽️ Menu APIs

### Public Endpoints

#### 1. Get All Menu Items
**GET** `/api/menu`

#### 2. Get Menu by Category
**GET** `/api/menu/category/:category`
- Categories: `Starter`, `Main Course`, `Dessert`, `Drinks`

#### 3. Get Menu by Type
**GET** `/api/menu/type/:type`
- Types: `Veg`, `Non-Veg`

#### 4. Search Menu Items
**GET** `/api/menu/search?q=pasta`

### Admin Endpoints

#### 5. Create Menu Item
**POST** `/api/menu`
**Headers:** `Authorization: Bearer <admin_token>`
```json
{
  "name": "Truffle Pasta",
  "description": "Rich, creamy pasta with shaved truffles",
  "price": 25.99,
  "category": "Main Course",
  "type": "Veg",
  "image_url": "https://example.com/pasta.jpg"
}
```

#### 6. Update Menu Item
**PUT** `/api/menu/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 7. Delete Menu Item
**DELETE** `/api/menu/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 8. Toggle Menu Item Availability
**PATCH** `/api/menu/:id/toggle`
**Headers:** `Authorization: Bearer <admin_token>`

#### 9. Get Menu Statistics
**GET** `/api/menu/stats/overview`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 🖼️ Gallery APIs

### Public Endpoints

#### 1. Get All Gallery Items
**GET** `/api/gallery`

#### 2. Get Gallery Item by ID
**GET** `/api/gallery/:id`

#### 3. Search Gallery Items
**GET** `/api/gallery/search?q=restaurant`

### Admin Endpoints

#### 4. Create Gallery Item
**POST** `/api/gallery`
**Headers:** `Authorization: Bearer <admin_token>`
```json
{
  "title": "Restaurant Interior",
  "description": "Beautiful dining area",
  "image_url": "https://example.com/interior.jpg"
}
```

#### 5. Update Gallery Item
**PUT** `/api/gallery/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 6. Delete Gallery Item
**DELETE** `/api/gallery/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 7. Get Gallery Statistics
**GET** `/api/gallery/stats/overview`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 🎉 Events APIs

### Public Endpoints

#### 1. Get All Events
**GET** `/api/events`

#### 2. Get Upcoming Events
**GET** `/api/events/upcoming`

#### 3. Get Event by ID
**GET** `/api/events/:id`

#### 4. Search Events
**GET** `/api/events/search?q=wine`

#### 5. Get Events by Date Range
**GET** `/api/events/range/search?startDate=2024-01-01&endDate=2024-01-31`

### Admin Endpoints

#### 6. Create Event
**POST** `/api/events`
**Headers:** `Authorization: Bearer <admin_token>`
```json
{
  "title": "Wine & Jazz Night",
  "description": "Sip fine wine and enjoy live jazz",
  "date": "2024-12-25",
  "time": "19:00",
  "location": "Main Dining Hall",
  "image_url": "https://example.com/wine-night.jpg"
}
```

#### 7. Update Event
**PUT** `/api/events/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 8. Delete Event
**DELETE** `/api/events/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 9. Get Event Statistics
**GET** `/api/events/stats/overview`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 👨‍💼 Admin Management APIs

### Admin Endpoints

#### 1. Get Dashboard Statistics
**GET** `/api/admin/dashboard/stats`
**Headers:** `Authorization: Bearer <admin_token>`

#### 2. Create New Admin
**POST** `/api/admin/create`
**Headers:** `Authorization: Bearer <admin_token>`
```json
{
  "username": "newadmin",
  "password": "password123"
}
```

#### 3. Get All Admins
**GET** `/api/admin/list`
**Headers:** `Authorization: Bearer <admin_token>`

#### 4. Delete Admin
**DELETE** `/api/admin/:id`
**Headers:** `Authorization: Bearer <admin_token>`

#### 5. Change Admin Password
**POST** `/api/admin/change-password`
**Headers:** `Authorization: Bearer <admin_token>`
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 🔒 Security Features

### JWT Token Structure
```json
{
  "adminId": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Token Blacklisting
- Tokens are blacklisted on logout
- Prevents token reuse after logout
- Stored in `blacklisted_tokens` table

### Input Validation
- All inputs are validated
- SQL injection prevention
- XSS protection
- Rate limiting (recommended)

---

## 🗄️ Database Schema

### Reservations Table
```sql
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  date DATE NOT NULL,
  time TIME NOT NULL,
  people INT NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Table
```sql
CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  type VARCHAR(20),
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gallery Table
```sql
CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admins Table
```sql
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  last_logout TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  last_logout TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blacklisted Tokens Table
```sql
CREATE TABLE blacklisted_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT NOT NULL,
  user_id INT NULL,
  admin_id INT NULL,
  blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token(255)),
  INDEX idx_user_id (user_id),
  INDEX idx_admin_id (admin_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Environment Variables
Create `.env` file:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=bitcrave
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Run Database Migrations
```sql
-- Run the schema.sql file in your MySQL database
source backend/sql/schema.sql
```

### 4. Start the Server
```bash
npm start
```

### 5. Test the API
```bash
# Test reservation creation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2024-12-25",
    "time": "19:30",
    "guests": 4,
    "message": "Window seat preferred"
  }'
```

---

## 📝 Notes

1. **Business Hours**: Reservations accepted 11:00 AM - 10:00 PM
2. **Capacity**: Maximum 5 reservations per time slot
3. **Guest Limits**: 1-20 guests per reservation
4. **File Uploads**: Currently using URL-based images (can be extended for file uploads)
5. **CORS**: Configured for cross-origin requests
6. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
7. **Validation**: Input validation on all endpoints
8. **Security**: JWT-based authentication with token blacklisting

---

## 🔧 Frontend Integration

### JavaScript Examples

#### Create Reservation
```javascript
const createReservation = async (data) => {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

#### Admin Login
```javascript
const adminLogin = async (credentials) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const result = await response.json();
  if (result.token) {
    localStorage.setItem('admin-token', result.token);
  }
  return result;
};
```

#### Get Menu Items
```javascript
const getMenu = async () => {
  const response = await fetch('/api/menu');
  return response.json();
};
```

This comprehensive API documentation covers all endpoints needed for the complete restaurant management system with full connectivity between frontend, staff, and admin interfaces.
