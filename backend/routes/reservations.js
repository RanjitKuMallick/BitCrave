const express = require('express');
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getUserReservations,
  getReservationsByDateRange,
  getTodayReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  checkAvailability,
  getReservationStats,
  confirmReservation,
  cancelReservation,
  getAvailableTables,
  getConfirmedReservations,
  checkTableAvailability
} = require('../controllers/reservationController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.post('/', createReservation);
router.get('/availability', checkAvailability);
router.get('/tables/available', getAvailableTables);
router.get('/check-availability', checkTableAvailability);
router.get('/user', getUserReservations);
router.get('/staff/confirmed', getConfirmedReservations);

// Admin routes (require authentication)
router.get('/', verifyAdminToken, getAllReservations);
router.get('/stats/overview', verifyAdminToken, getReservationStats);
router.get('/today/list', verifyAdminToken, getTodayReservations);
router.get('/range/search', verifyAdminToken, getReservationsByDateRange);
router.patch('/:id/confirm', verifyAdminToken, confirmReservation);
router.patch('/:id/cancel', verifyAdminToken, cancelReservation);
router.delete('/:id', verifyAdminToken, deleteReservation);

// Public route for updating reservations (for staff)
router.put('/:id', updateReservation);

// Public route for getting reservation by ID (must be last)
router.get('/:id', getReservationById);

module.exports = router;
