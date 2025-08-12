const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByDateRange,
  getEventStats,
  searchEvents
} = require('../controllers/eventController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEventById);
router.get('/search', searchEvents);
router.get('/range/search', getEventsByDateRange);

// Admin routes (require authentication)
router.post('/', verifyAdminToken, createEvent);
router.put('/:id', verifyAdminToken, updateEvent);
router.delete('/:id', verifyAdminToken, deleteEvent);
router.get('/stats/overview', verifyAdminToken, getEventStats);

module.exports = router;
