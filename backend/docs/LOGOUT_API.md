# Logout API Documentation

## Overview
This document describes the comprehensive logout API implementation for both users and admins in the restaurant management system.

## Features
- ✅ Secure token invalidation
- ✅ Token blacklisting for enhanced security
- ✅ Last logout timestamp tracking
- ✅ Automatic cleanup of old blacklisted tokens
- ✅ Comprehensive error handling
- ✅ Logout statistics and monitoring

## API Endpoints

### 1. User Logout
**Endpoint:** `POST /api/users/logout`  
**Authentication:** Bearer Token Required

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "No token provided"
}
```
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 2. Admin Logout
**Endpoint:** `POST /api/admin/logout`  
**Authentication:** Bearer Token Required

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Admin logout successful"
}
```

## Security Features

### 1. Token Blacklisting
- Tokens are stored in `blacklisted_tokens` table after logout
- Prevents token reuse even if not expired
- Automatic cleanup of old blacklisted tokens (30+ days)

### 2. Last Logout Tracking
- Updates `last_logout` timestamp in user/admin tables
- Useful for security monitoring and analytics

### 3. Token Validation
- Verifies token authenticity before logout
- Handles expired and invalid tokens gracefully

## Database Schema

### Blacklisted Tokens Table
```sql
CREATE TABLE IF NOT EXISTS blacklisted_tokens (
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

### Updated User/Admin Tables
```sql
-- Users table with last_logout field
ALTER TABLE users ADD COLUMN last_logout TIMESTAMP NULL;

-- Admins table with last_logout field  
ALTER TABLE admins ADD COLUMN last_logout TIMESTAMP NULL;
```

## Implementation Details

### 1. Logout Process Flow
1. Extract token from Authorization header
2. Verify token validity using JWT
3. Blacklist token in database
4. Update last logout timestamp
5. Return success response

### 2. Error Handling
- Graceful handling of missing tokens
- Invalid/expired token detection
- Database operation failures
- Network and server errors

### 3. Performance Considerations
- Indexed token lookups for fast blacklist checking
- Automatic cleanup of old blacklisted tokens
- Efficient database queries with proper indexing

## Usage Examples

### Frontend JavaScript
```javascript
// User logout
const logoutUser = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    if (data.success) {
      localStorage.removeItem('userToken');
      // Redirect to login page
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Admin logout
const logoutAdmin = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    if (data.success) {
      localStorage.removeItem('adminToken');
      // Redirect to admin login page
      window.location.href = '/admin/login.html';
    }
  } catch (error) {
    console.error('Admin logout error:', error);
  }
};
```

### Middleware Integration
```javascript
// Add blacklist check to existing auth middleware
const checkBlacklistedToken = require('../middleware/checkBlacklistedToken');

// Use in protected routes
router.get('/protected-route', checkBlacklistedToken, verifyToken, (req, res) => {
  // Route logic here
});
```

## Maintenance

### 1. Cleanup Old Tokens
```javascript
// Run periodically (e.g., daily cron job)
const { cleanupOldBlacklistedTokens } = require('../utils/logoutUtils');

const cleanup = async () => {
  const cleanedCount = await cleanupOldBlacklistedTokens();
  console.log(`Cleaned up ${cleanedCount} old blacklisted tokens`);
};
```

### 2. Monitor Logout Statistics
```javascript
// Get logout statistics
const { getLogoutStats } = require('../utils/logoutUtils');

const getStats = async () => {
  const stats = await getLogoutStats();
  console.log('Logout Statistics:', stats);
};
```

## Security Best Practices

1. **Always use HTTPS** in production
2. **Set appropriate token expiration times**
3. **Implement rate limiting** on logout endpoints
4. **Monitor failed logout attempts**
5. **Regular security audits** of blacklisted tokens
6. **Use strong JWT secrets** stored in environment variables

## Troubleshooting

### Common Issues

1. **Token not found in blacklist**
   - Check if blacklist table exists
   - Verify database connection
   - Check token format in Authorization header

2. **Database errors during logout**
   - Verify database schema is up to date
   - Check database connection
   - Review error logs for specific issues

3. **Performance issues**
   - Ensure proper indexing on token columns
   - Regular cleanup of old blacklisted tokens
   - Monitor database query performance

## Testing

### Test Cases
1. Valid token logout
2. Invalid token logout
3. Expired token logout
4. Missing token logout
5. Database connection failure
6. Token blacklist verification
7. Last logout timestamp update

### Test Commands
```bash
# Test user logout
curl -X POST http://localhost:5000/api/users/logout \
  -H "Authorization: Bearer <valid_token>" \
  -H "Content-Type: application/json"

# Test admin logout
curl -X POST http://localhost:5000/api/admin/logout \
  -H "Authorization: Bearer <valid_admin_token>" \
  -H "Content-Type: application/json"
```
