const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), attendanceController.recordAttendance);
router.get('/event/:eventId', attendanceController.getEventAttendance);
router.get('/summary/:eventId', attendanceController.getAttendanceSummary);

module.exports = router;
