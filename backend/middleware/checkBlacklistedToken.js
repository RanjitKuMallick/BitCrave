// middleware/checkBlacklistedToken.js
const db = require('../config/db');

const checkBlacklistedToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    // Check if token is blacklisted
    try {
      const [blacklistedTokens] = await db.query(
        'SELECT * FROM blacklisted_tokens WHERE token = ?',
        [token]
      );

      if (blacklistedTokens.length > 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token has been invalidated' 
        });
      }
    } catch (dbError) {
      // If blacklist table doesn't exist, continue without checking
      console.log('Blacklist table not available, skipping blacklist check');
    }

    next();
  } catch (error) {
    console.error('Blacklist check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during token validation' 
    });
  }
};

module.exports = checkBlacklistedToken;
