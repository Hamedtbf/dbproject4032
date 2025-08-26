const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.put('/editprofile', dashboardController.editProfile);
router.get('/cities', dashboardController.getCities);
router.get('/tickets', dashboardController.getTickets);
router.get('/tickets/:id', dashboardController.getTicketDetails);
router.post('/reserve', dashboardController.reserveTicket);
router.get('/reservations', dashboardController.getReservations);
router.post('/payment', dashboardController.makePayment);
router.put('/cancel', dashboardController.cancelTicket);

module.exports = router;
