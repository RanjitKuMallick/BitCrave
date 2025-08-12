const jwt = require('jsonwebtoken');
const db = require('../models/db');

module.exports = async function verifyAdminToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if session exists and is active in database
    const [sessions] = await db.query(
      'SELECT * FROM admin_sessions WHERE session_token = ? AND is_active = TRUE AND expires_at > NOW()',
      [decoded.sessionToken]
    );

    if (sessions.length === 0) {
      return res.status(403).json({ message: 'Session expired or invalid.' });
    }

    // Update last activity
    await db.query(
      'UPDATE admin_sessions SET last_activity = NOW() WHERE session_token = ?',
      [decoded.sessionToken]
    );

    req.admin = decoded; // Attach decoded data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
