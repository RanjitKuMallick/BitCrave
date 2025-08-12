# 🚀 BitCrave Restaurant Management System - Setup Guide

## 🔧 Quick Fix for Admin Login Issue

If you're unable to login as admin, follow these steps:

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm start
```

### Step 2: Set Up Database
1. Create a MySQL database named `bitcrave`
2. Run the schema file:
```bash
mysql -u your_username -p bitcrave < sql/schema.sql
```

### Step 3: Create Admin User
```bash
node setup-admin.js
```

This will create the default admin user:
- **Username**: `admin`
- **Password**: `admin123`

### Step 4: Test Admin Login
```bash
node test-admin-login.js
```

### Step 5: Access Admin Panel
1. Open `admin/login.html` in your browser
2. Use the credentials: `admin` / `admin123`
3. You should be redirected to the dashboard

---

## 🔍 Troubleshooting

### Issue: "Invalid credentials" error
**Solution**: 
1. Make sure the server is running (`npm start`)
2. Run the setup script (`node setup-admin.js`)
3. Check if the `admins` table exists and has data

### Issue: "Network error" 
**Solution**:
1. Verify the backend server is running on port 5000
2. Check your database connection in `models/db.js`
3. Ensure CORS is properly configured

### Issue: Database connection error
**Solution**:
1. Check your MySQL service is running
2. Verify database credentials in `.env` file
3. Create the database if it doesn't exist:
```sql
CREATE DATABASE bitcrave;
```

### Issue: "Table doesn't exist" error
**Solution**:
1. Run the schema file again:
```bash
mysql -u your_username -p bitcrave < sql/schema.sql
```

---

## 📋 Complete Setup Checklist

### ✅ Backend Setup
- [ ] Install dependencies: `npm install`
- [ ] Create `.env` file with database credentials
- [ ] Start server: `npm start`
- [ ] Verify server is running on http://localhost:5000

### ✅ Database Setup
- [ ] Create MySQL database: `bitcrave`
- [ ] Run schema: `mysql -u user -p bitcrave < sql/schema.sql`
- [ ] Verify tables are created

### ✅ Admin Setup
- [ ] Run admin setup: `node setup-admin.js`
- [ ] Test admin login: `node test-admin-login.js`
- [ ] Verify admin user exists in database

### ✅ Frontend Setup
- [ ] Open `admin/login.html` in browser
- [ ] Login with admin/admin123
- [ ] Verify redirect to dashboard works

---

## 🗄️ Database Configuration

### Create `.env` file in backend folder:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=bitcrave
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Verify Database Tables:
```sql
USE bitcrave;
SHOW TABLES;
-- Should show: admins, users, reservations, menu, gallery, events, blacklisted_tokens

SELECT * FROM admins;
-- Should show at least one admin user
```

---

## 🧪 Testing the System

### Test Admin Login API:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Expected Response:
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "lastLogin": null
  }
}
```

---

## 🔐 Security Notes

1. **Change Default Password**: After first login, change the default password
2. **JWT Secret**: Use a strong, unique JWT secret in production
3. **Database Security**: Use strong database passwords
4. **HTTPS**: Use HTTPS in production environment

---

## 📞 Support

If you're still having issues:

1. **Check Server Logs**: Look for error messages in the terminal
2. **Database Connection**: Verify MySQL is running and accessible
3. **Port Conflicts**: Ensure port 5000 is not used by another application
4. **Browser Console**: Check for JavaScript errors in browser developer tools

### Common Error Messages:

- `ER_ACCESS_DENIED_ERROR`: Database credentials are incorrect
- `ECONNREFUSED`: Database server is not running
- `ER_NO_SUCH_TABLE`: Schema not properly loaded
- `401 Unauthorized`: Invalid admin credentials
- `500 Internal Server Error`: Check server logs for details

---

## 🎯 Quick Commands Summary

```bash
# 1. Start server
cd backend && npm start

# 2. Setup admin (in new terminal)
cd backend && node setup-admin.js

# 3. Test login (in new terminal)
cd backend && node test-admin-login.js

# 4. Access admin panel
# Open admin/login.html in browser
```

Follow these steps and you should be able to login as admin successfully! 🎉
