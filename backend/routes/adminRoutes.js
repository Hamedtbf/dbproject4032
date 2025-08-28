const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect and authorize all routes in this file for 'admin' role
router.use(protect, authorize('admin'));

router.get('/reservations', adminController.adminGetReservations);
router.post('/reservations/:reservation_id', adminController.adminUpdateReservation);
router.get('/reports', adminController.adminGetReports);
router.post('/reports/:report_id', adminController.adminUpdateReport);

module.exports = router;
