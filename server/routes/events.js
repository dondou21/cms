const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

router.post('/', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), eventController.createEvent);
router.put('/:id', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), eventController.updateEvent);
router.put('/:id/attendance', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), eventController.updateAttendance);
router.delete('/:id', authorize('Admin'), eventController.deleteEvent);

module.exports = router;
