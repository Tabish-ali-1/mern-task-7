const express = require('express');
const { bookAppointment, getMyAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Both doctors and patients need to see their appointments
router.get('/me', protect, getMyAppointments);

// Patients book appointments
router.post('/book', protect, authorize('patient'), bookAppointment);

// Doctors update status (Approve, Reject, Complete)
router.put('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

module.exports = router;
