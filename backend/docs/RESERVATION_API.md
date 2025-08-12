# Reservation API Documentation

## Base URL
```
http://localhost:5000/api/reservations
```

## Authentication
- Public endpoints: No authentication required
- Admin endpoints: Require admin token in Authorization header
  ```
  Authorization: Bearer <admin_token>
  ```

## Endpoints

### 1. Create Reservation (Public)
**POST** `/api/reservations`

Create a new reservation.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2024-01-15",
  "time": "19:30",
  "guests": 4,
  "message": "Window seat preferred"
}
```

**Response (201):**
```json
{
  "message": "Reservation created successfully",
  "reservationId": 123,
  "reservation": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2024-01-15",
    "time": "19:30",
    "guests": 4,
    "message": "Window seat preferred"
  }
}
```

**Validation Rules:**
- `name`, `date`, `time`, `guests` are required
- Date cannot be in the past
- Time must be in HH:MM format
- Time must be between 11:00 AM and 10:00 PM
- Guests must be between 1 and 20
- Maximum 5 reservations per time slot

---

### 2. Check Availability (Public)
**GET** `/api/reservations/availability?date=2024-01-15&time=19:30`

Check if a specific date and time slot is available.

**Response (200):**
```json
{
  "success": true,
  "date": "2024-01-15",
  "time": "19:30",
  "isAvailable": true,
  "currentBookings": 2,
  "maxBookings": 5
}
```

---

### 3. Get Reservation by ID (Public)
**GET** `/api/reservations/:id`

Get details of a specific reservation.

**Response (200):**
```json
{
  "success": true,
  "reservation": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2024-01-15",
    "time": "19:30",
    "people": 4,
    "message": "Window seat preferred",
    "created_at": "2024-01-10T10:30:00.000Z"
  }
}
```

**Response (404):**
```json
{
  "message": "Reservation not found"
}
```

---

### 4. Get All Reservations (Admin Only)
**GET** `/api/reservations`

Get all reservations (requires admin authentication).

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "reservations": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date": "2024-01-15",
      "time": "19:30",
      "people": 4,
      "message": "Window seat preferred",
      "created_at": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get Today's Reservations (Admin Only)
**GET** `/api/reservations/today/list`

Get all reservations for today (requires admin authentication).

**Response (200):**
```json
{
  "success": true,
  "count": 8,
  "reservations": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date": "2024-01-15",
      "time": "19:30",
      "people": 4,
      "message": "Window seat preferred",
      "created_at": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

---

### 6. Get Reservations by Date Range (Admin Only)
**GET** `/api/reservations/range/search?startDate=2024-01-01&endDate=2024-01-31`

Get reservations within a date range (requires admin authentication).

**Response (200):**
```json
{
  "success": true,
  "count": 45,
  "reservations": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date": "2024-01-15",
      "time": "19:30",
      "people": 4,
      "message": "Window seat preferred",
      "created_at": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

---

### 7. Update Reservation (Admin Only)
**PUT** `/api/reservations/:id`

Update an existing reservation (requires admin authentication).

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1234567890",
  "date": "2024-01-16",
  "time": "20:00",
  "guests": 6,
  "message": "Updated message"
}
```

**Response (200):**
```json
{
  "message": "Reservation updated successfully",
  "reservationId": 123
}
```

---

### 8. Delete Reservation (Admin Only)
**DELETE** `/api/reservations/:id`

Delete a reservation (requires admin authentication).

**Response (200):**
```json
{
  "message": "Reservation deleted successfully",
  "reservationId": 123
}
```

---

### 9. Get Reservation Statistics (Admin Only)
**GET** `/api/reservations/stats/overview`

Get reservation statistics (requires admin authentication).

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "today": 8,
    "thisWeek": 45,
    "thisMonth": 120
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Name, date, time, and number of guests are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. Admin token required."
}
```

### 404 Not Found
```json
{
  "message": "Reservation not found"
}
```

### 409 Conflict
```json
{
  "message": "Sorry, this time slot is fully booked. Please choose another time."
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error while creating reservation"
}
```

---

## Usage Examples

### JavaScript (Fetch API)
```javascript
// Create a reservation
const createReservation = async (reservationData) => {
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating reservation:', error);
  }
};

// Check availability
const checkAvailability = async (date, time) => {
  try {
    const response = await fetch(`/api/reservations/availability?date=${date}&time=${time}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking availability:', error);
  }
};

// Get all reservations (admin)
const getAllReservations = async (adminToken) => {
  try {
    const response = await fetch('/api/reservations', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
};
```

### cURL Examples
```bash
# Create reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2024-01-15",
    "time": "19:30",
    "guests": 4,
    "message": "Window seat preferred"
  }'

# Check availability
curl "http://localhost:5000/api/reservations/availability?date=2024-01-15&time=19:30"

# Get all reservations (admin)
curl -X GET http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Database Schema

The reservations table structure:
```sql
CREATE TABLE IF NOT EXISTS reservations (
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

---

## Notes

1. **Time Format**: All times should be in 24-hour format (HH:MM)
2. **Date Format**: All dates should be in YYYY-MM-DD format
3. **Business Hours**: Reservations are only accepted between 11:00 AM and 10:00 PM
4. **Capacity**: Maximum 5 reservations per time slot
5. **Guest Limit**: 1-20 guests per reservation
6. **Authentication**: Admin endpoints require a valid admin token
7. **Error Handling**: All endpoints return appropriate HTTP status codes and error messages
