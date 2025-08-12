# 🔌 BitCrave API Reference Guide

## 📡 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Headers
```javascript
// For protected routes
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

## 👥 User Authentication

### Register User
```http
POST /users/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
}
```

### Database Login
```http
POST /users/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

### Firebase Login
```http
POST /users/firebase-login
Content-Type: application/json

{
    "firebase_uid": "firebase_user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "1234567890",
    "photo_url": "https://example.com/photo.jpg"
}
```

### Logout
```http
POST /users/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🍽️ Reservations

### Create Reservation
```http
POST /reservations
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "date": "2025-08-25",
    "time": "19:00",
    "guests": 4,
    "table_id": 1,
    "special_requests": "Window seat preferred"
}
```

### Get User Reservations
```http
GET /reservations/user?email=john@example.com
```

### Get All Reservations (Admin)
```http
GET /reservations
Authorization: Bearer ADMIN_TOKEN
```

### Get Available Tables
```http
GET /reservations/tables/available?date=2025-08-25&time=19:00&people=4
```

### Check Table Availability
```http
GET /reservations/check-availability?date=2025-08-25&time=19:00&people=4
```

### Update Reservation
```http
PUT /reservations/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "status": "confirmed",
    "special_requests": "Updated request"
}
```

### Delete Reservation
```http
DELETE /reservations/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 🍽️ Menu Management

### Get All Menu Items
```http
GET /menu
```

### Add Menu Item (Admin)
```http
POST /menu
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "name": "Margherita Pizza",
    "description": "Classic tomato and mozzarella",
    "price": 12.99,
    "category": "Pizza"
}
```

### Update Menu Item (Admin)
```http
PUT /menu/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "name": "Margherita Pizza",
    "price": 14.99
}
```

### Delete Menu Item (Admin)
```http
DELETE /menu/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 👨‍💼 Staff Management

### Staff Login
```http
POST /staff/login
Content-Type: application/json

{
    "email": "staff@bitcrave.com",
    "password": "staffpassword"
}
```

### Get Staff Profile
```http
GET /staff/profile
Authorization: Bearer STAFF_TOKEN
```

### Update Staff Profile
```http
PUT /staff/profile
Authorization: Bearer STAFF_TOKEN
Content-Type: application/json

{
    "name": "Updated Name",
    "phone": "9876543210"
}
```

### Get Assigned Tables
```http
GET /staff/tables
Authorization: Bearer STAFF_TOKEN
```

---

## 🔧 Admin Management

### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
    "email": "admin@bitcrave.com",
    "password": "adminpassword"
}
```

### Get Dashboard Data
```http
GET /admin/dashboard
Authorization: Bearer ADMIN_TOKEN
```

### Get All Reservations
```http
GET /admin/reservations
Authorization: Bearer ADMIN_TOKEN
```

### Update Reservation (Admin)
```http
PUT /admin/reservations/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "status": "confirmed",
    "payment_status": "paid"
}
```

### Delete Reservation (Admin)
```http
DELETE /admin/reservations/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 🏠 Tables Management

### Get All Tables
```http
GET /tables
```

### Add Table (Admin)
```http
POST /tables
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "table_number": 10,
    "capacity": 6
}
```

### Update Table Status
```http
PUT /tables/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "status": "occupied"
}
```

---

## 📸 Gallery Management

### Get All Images
```http
GET /gallery
```

### Upload Image (Admin)
```http
POST /gallery
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data

{
    "image": [file],
    "title": "Restaurant Interior",
    "description": "Beautiful dining area"
}
```

### Delete Image (Admin)
```http
DELETE /gallery/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 🎉 Events Management

### Get All Events
```http
GET /events
```

### Add Event (Admin)
```http
POST /events
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "title": "Live Music Night",
    "description": "Enjoy live music with dinner",
    "date": "2025-08-30",
    "time": "20:00"
}
```

### Update Event (Admin)
```http
PUT /events/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
    "title": "Updated Event Title"
}
```

### Delete Event (Admin)
```http
DELETE /events/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 📊 Response Formats

### Success Response
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {
        // Response data
    }
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

### Pagination Response
```json
{
    "success": true,
    "data": [
        // Array of items
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "pages": 10
    }
}
```

---

## 🔒 Authentication Tokens

### JWT Token Structure
```javascript
// Token payload
{
    "id": 1,
    "email": "user@example.com",
    "firebase_uid": "firebase_user_id",
    "iat": 1640995200,
    "exp": 1641081600
}
```

### Token Storage
```javascript
// Frontend storage
sessionStorage.setItem("bitcrave-token", token);
sessionStorage.setItem("bitcrave-user", JSON.stringify(userData));
sessionStorage.setItem("bitcrave-firebase-token", firebaseToken);
```

---

## 🧪 Testing Endpoints

### Test Database Connection
```http
GET /test-db
```

### Test Firebase Endpoint
```http
POST /users/firebase-login
Content-Type: application/json

{
    "firebase_uid": "test_uid_123",
    "email": "test@example.com",
    "name": "Test User"
}
```

### Test Email Integration
```http
POST /test-email
Content-Type: application/json

{
    "to_email": "test@example.com",
    "to_name": "Test User"
}
```

---

## 📝 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## 🔧 Environment Variables

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bitcrave

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=development
```

---

## 📞 Support

For API support and questions:
- Check the main documentation: `PROJECT_DOCUMENTATION.md`
- Test endpoints using the provided examples
- Monitor server logs for debugging
- Use browser developer tools for frontend debugging

---

*Last Updated: August 2025*
*API Version: 1.0.0*
