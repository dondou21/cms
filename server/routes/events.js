const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// router.use(protect);

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.put('/:id/attendance', eventController.updateAttendance);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
