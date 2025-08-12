// controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    await db.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token (optional but recommended)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    // Verify the token to get user info
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Add token to blacklist (optional)
    // You can implement a blacklist table to track logged out tokens
    
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
};

// Firebase login/registration endpoint
exports.firebaseLogin = async (req, res) => {
  const { firebase_uid, email, name, phone, photo_url } = req.body;

  if (!firebase_uid || !email) {
    return res.status(400).json({ message: 'Firebase UID and email are required' });
  }

  try {
    // Check if user exists by Firebase UID
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE firebase_uid = ? OR email = ?', 
      [firebase_uid, email]
    );

    let user;

    if (existingUsers.length > 0) {
      // User exists, update Firebase UID if needed
      user = existingUsers[0];
      
      if (!user.firebase_uid) {
        // Update existing user with Firebase UID
        await db.query(
          'UPDATE users SET firebase_uid = ?, name = ?, phone = ?, photo_url = ? WHERE id = ?',
          [firebase_uid, name || user.name, phone || user.phone, photo_url || user.photo_url, user.id]
        );
        
        // Get updated user data
        const [updatedUsers] = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
        user = updatedUsers[0];
      }
    } else {
      // Create new user
      const [result] = await db.query(
        'INSERT INTO users (firebase_uid, name, email, phone, photo_url, auth_type) VALUES (?, ?, ?, ?, ?, ?)',
        [firebase_uid, name || 'Firebase User', email, phone || '', photo_url || '', 'firebase']
      );

      const [newUsers] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUsers[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, firebase_uid: user.firebase_uid },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Firebase authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        firebase_uid: user.firebase_uid,
        photo_url: user.photo_url
      }
    });
  } catch (err) {
    console.error('Firebase login error:', err);
    res.status(500).json({ message: 'Server error during Firebase authentication' });
  }
};

