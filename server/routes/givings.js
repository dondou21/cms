const express = require('express');
const router = express.Router();
const givingController = require('../controllers/givingController');
const { protect, authorize } = require('../middleware/auth');

// router.use(protect);

router.get('/', givingController.getGivings);
router.get('/report', givingController.getMonthlyReport);

router.post('/', givingController.recordGiving);

module.exports = router;
