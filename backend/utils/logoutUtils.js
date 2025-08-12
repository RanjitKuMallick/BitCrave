// utils/logoutUtils.js
const db = require('../config/db');

/**
 * Blacklist a token to prevent reuse after logout
 * @param {string} token - JWT token to blacklist
 * @param {number} userId - User ID (optional for admin tokens)
 * @param {number} adminId - Admin ID (optional for user tokens)
 * @returns {Promise<boolean>} - Success status
 */
const blacklistToken = async (token, userId = null, adminId = null) => {
  try {
    await db.query(
      'INSERT INTO blacklisted_tokens (token, user_id, admin_id) VALUES (?, ?, ?)',
      [token, userId, adminId]
    );
    return true;
  } catch (error) {
    console.error('Error blacklisting token:', error);
    return false;
  }
};

/**
 * Check if a token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {Promise<boolean>} - True if blacklisted, false otherwise
 */
const isTokenBlacklisted = async (token) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM blacklisted_tokens WHERE token = ?',
      [token]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking blacklisted token:', error);
    return false;
  }
};

/**
 * Update user's last logout timestamp
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
const updateUserLastLogout = async (userId) => {
  try {
    await db.query(
      'UPDATE users SET last_logout = NOW() WHERE id = ?',
      [userId]
    );
    return true;
  } catch (error) {
    console.error('Error updating user last logout:', error);
    return false;
  }
};

/**
 * Update admin's last logout timestamp
 * @param {number} adminId - Admin ID
 * @returns {Promise<boolean>} - Success status
 */
const updateAdminLastLogout = async (adminId) => {
  try {
    await db.query(
      'UPDATE admins SET last_logout = NOW() WHERE id = ?',
      [adminId]
    );
    return true;
  } catch (error) {
    console.error('Error updating admin last logout:', error);
    return false;
  }
};

/**
 * Clean up old blacklisted tokens (older than 30 days)
 * @returns {Promise<number>} - Number of tokens cleaned up
 */
const cleanupOldBlacklistedTokens = async () => {
  try {
    const [result] = await db.query(
      'DELETE FROM blacklisted_tokens WHERE blacklisted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Error cleaning up old blacklisted tokens:', error);
    return 0;
  }
};

/**
 * Get logout statistics
 * @returns {Promise<Object>} - Logout statistics
 */
const getLogoutStats = async () => {
  try {
    const [userStats] = await db.query(
      'SELECT COUNT(*) as total_users, COUNT(last_logout) as users_with_logout FROM users'
    );
    
    const [adminStats] = await db.query(
      'SELECT COUNT(*) as total_admins, COUNT(last_logout) as admins_with_logout FROM admins'
    );
    
    const [blacklistStats] = await db.query(
      'SELECT COUNT(*) as total_blacklisted FROM blacklisted_tokens'
    );

    return {
      users: userStats[0],
      admins: adminStats[0],
      blacklistedTokens: blacklistStats[0].total_blacklisted
    };
  } catch (error) {
    console.error('Error getting logout stats:', error);
    return null;
  }
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
  updateUserLastLogout,
  updateAdminLastLogout,
  cleanupOldBlacklistedTokens,
  getLogoutStats
};
