const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Staff login (public)
router.post('/login', staffController.staffLogin);

// Get staff's assigned tables for today (public)
router.get('/:staff_id/tables', staffController.getStaffAssignedTables);

// Get reservations for staff's assigned tables (public)
router.get('/:staff_id/reservations', staffController.getStaffReservations);

// Admin-only routes
router.use(verifyAdminToken);

// Assign table to staff (admin only)
router.post('/assign-table', staffController.assignTableToStaff);

// Unassign table from staff (admin only)
router.delete('/unassign-table', staffController.unassignTableFromStaff);

// Get all staff members (admin only)
router.get('/', staffController.getAllStaff);

// Get staff by ID (admin only)
router.get('/:id', staffController.getStaffById);

// Create new staff member (admin only)
router.post('/', staffController.createStaff);

// Update staff member (admin only)
router.put('/:id', staffController.updateStaff);

// Delete staff member (admin only)
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
