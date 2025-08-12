const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuByCategory,
  getMenuByType,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getMenuStats,
  searchMenuItems
} = require('../controllers/menuController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.get('/', getAllMenuItems);
router.get('/category/:category', getMenuByCategory);
router.get('/type/:type', getMenuByType);
router.get('/search', searchMenuItems);

// Admin routes (require authentication)
router.post('/', verifyAdminToken, createMenuItem);
router.put('/:id', verifyAdminToken, updateMenuItem);
router.delete('/:id', verifyAdminToken, deleteMenuItem);
router.patch('/:id/toggle', verifyAdminToken, toggleAvailability);
router.get('/stats/overview', verifyAdminToken, getMenuStats);

module.exports = router;
