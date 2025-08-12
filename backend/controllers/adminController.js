const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../models/db');

// Admin login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required' 
    });
  }

  try {
    // Find admin by username
    const [admins] = await db.query(
      'SELECT * FROM admins WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    const admin = admins[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create session in database
    await db.query(
      'INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES (?, ?, ?)',
      [admin.id, sessionToken, expiresAt]
    );

    // Update last login
    await db.query(
      'UPDATE admins SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token for API access
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        username: admin.username,
        role: 'admin',
        sessionToken: sessionToken
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      sessionToken: sessionToken,
      admin: {
        id: admin.id,
        username: admin.username,
        lastLogin: admin.last_login
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Admin logout
exports.adminLogout = async (req, res) => {
  const adminId = req.admin.adminId;
  const sessionToken = req.admin.sessionToken;
  
  try {
    // Deactivate session in database
    await db.query(
      'UPDATE admin_sessions SET is_active = FALSE WHERE admin_id = ? AND session_token = ?',
      [adminId, sessionToken]
    );

    // Update last logout time
    await db.query(
      'UPDATE admins SET last_logout = NOW() WHERE id = ?',
      [adminId]
    );

    // Add token to blacklist
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await db.query(
        'INSERT INTO blacklisted_tokens (token, admin_id) VALUES (?, ?)',
        [token, adminId]
      );
    }

    res.json({ message: 'Admin logged out successfully' });
  } catch (err) {
    console.error('Admin logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// Check admin session status
exports.checkSession = async (req, res) => {
  const adminId = req.admin.adminId;
  
  try {
    // Get admin info
    const [admins] = await db.query(
      'SELECT id, username, last_login, last_logout FROM admins WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = admins[0];

    // Get active session info
    const [sessions] = await db.query(
      'SELECT created_at, last_activity, expires_at FROM admin_sessions WHERE admin_id = ? AND is_active = TRUE AND expires_at > NOW()',
      [adminId]
    );

    res.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        lastLogin: admin.last_login,
        lastLogout: admin.last_logout,
        sessionActive: sessions.length > 0,
        sessionInfo: sessions[0] || null
      }
    });
  } catch (err) {
    console.error('Check session error:', err);
    res.status(500).json({ message: 'Server error while checking session' });
  }
};

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Total reservations
    const [reservationsResult] = await db.query('SELECT COUNT(*) as total FROM reservations');
    
    // Today's reservations
    const today = new Date().toISOString().split('T')[0];
    const [todayResult] = await db.query(
      'SELECT COUNT(*) as today FROM reservations WHERE date = ?',
      [today]
    );
    
    // Total menu items
    const [menuResult] = await db.query('SELECT COUNT(*) as total FROM menu');
    
    // Available menu items
    const [availableMenuResult] = await db.query('SELECT COUNT(*) as available FROM menu WHERE available = TRUE');
    
    // Total events
    const [eventsResult] = await db.query('SELECT COUNT(*) as total FROM events');
    
    // Upcoming events
    const [upcomingEventsResult] = await db.query(
      'SELECT COUNT(*) as upcoming FROM events WHERE date >= CURDATE()'
    );
    
    // Total gallery items
    const [galleryResult] = await db.query('SELECT COUNT(*) as total FROM gallery');
    
    // Recent reservations (last 7 days)
    const [recentReservationsResult] = await db.query(
      'SELECT COUNT(*) as recent FROM reservations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    res.json({
      success: true,
      stats: {
        reservations: {
          total: reservationsResult[0].total,
          today: todayResult[0].today,
          recent: recentReservationsResult[0].recent
        },
        menu: {
          total: menuResult[0].total,
          available: availableMenuResult[0].available
        },
        events: {
          total: eventsResult[0].total,
          upcoming: upcomingEventsResult[0].upcoming
        },
        gallery: {
          total: galleryResult[0].total
        }
      }
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};

// Create new admin
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    // Check if admin already exists
    const [existing] = await db.query(
      'SELECT id FROM admins WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ 
        message: 'Admin with this username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const [result] = await db.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ 
      message: 'Admin created successfully',
      adminId: result.insertId
    });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ message: 'Server error while creating admin' });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, last_logout, created_at FROM admins ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      count: rows.length,
      admins: rows
    });
  } catch (err) {
    console.error('Get admins error:', err);
    res.status(500).json({ message: 'Server error while fetching admins' });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const currentAdminId = req.admin.adminId;
  
  if (parseInt(id) === currentAdminId) {
    return res.status(400).json({ 
      message: 'Cannot delete your own account' 
    });
  }

  try {
    // Check if admin exists
    const [existing] = await db.query(
      'SELECT id FROM admins WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await db.query('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ 
      message: 'Admin deleted successfully',
      adminId: id
    });
  } catch (err) {
    console.error('Delete admin error:', err);
    res.status(500).json({ message: 'Server error while deleting admin' });
  }
};

// Change admin password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin.adminId;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      message: 'Current password and new password are required' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      message: 'New password must be at least 6 characters long' 
    });
  }

  try {
    // Get current admin
    const [admins] = await db.query(
      'SELECT password FROM admins WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admins[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.query(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedNewPassword, adminId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error while changing password' });
  }
}; 