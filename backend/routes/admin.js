// routes/admin.js
const express = require('express');
const router = express.Router();
const {
  adminLogin,
  adminLogout,
  checkSession,
  getDashboardStats,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  changePassword
} = require('../controllers/adminController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.post('/login', adminLogin);

// Protected routes (require admin authentication)
router.post('/logout', verifyAdminToken, adminLogout);
router.get('/session', verifyAdminToken, checkSession);
router.get('/dashboard/stats', verifyAdminToken, getDashboardStats);
router.post('/create', verifyAdminToken, createAdmin);
router.get('/list', verifyAdminToken, getAllAdmins);
router.delete('/:id', verifyAdminToken, deleteAdmin);
router.post('/change-password', verifyAdminToken, changePassword);

module.exports = router;
