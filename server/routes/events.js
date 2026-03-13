const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

router.post('/', authorize('Admin', 'Pastor/Leader'), eventController.createEvent);
router.put('/:id', authorize('Admin', 'Pastor/Leader'), eventController.updateEvent);
router.delete('/:id', authorize('Admin'), eventController.deleteEvent);

module.exports = router;
