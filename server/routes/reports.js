const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
router.use(authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'));

router.get('/dashboard', reportController.getDashboardSummary);
router.get('/integration-stats', reportController.getIntegrationStats);
router.get('/attendance-trends', reportController.getAttendanceTrends);
router.get('/members-by-ministry', reportController.getMembersByMinistry);
module.exports = router;
