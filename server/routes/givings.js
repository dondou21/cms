const express = require('express');
const router = express.Router();
const givingController = require('../controllers/givingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', givingController.getGivings);
router.get('/report', authorize('Admin', 'Pastor/Leader', 'Finance Officer'), givingController.getMonthlyReport);

router.post('/', authorize('Admin', 'Finance Officer'), givingController.recordGiving);

module.exports = router;
