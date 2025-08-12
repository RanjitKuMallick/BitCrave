const express = require('express');
const router = express.Router();
const verifyAdminToken = require('../middleware/verifyAdminToken');
const db = require('../models/db');

// Get all tables (admin only)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const [tables] = await db.query('SELECT * FROM tables ORDER BY table_number');
    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: 'Server error while fetching tables' });
  }
});

module.exports = router;
