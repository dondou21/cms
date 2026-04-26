const express = require('express');
const router = express.Router();
const serviceReportController = require('../controllers/serviceReportController');

router.post('/', serviceReportController.createReport);
router.get('/', serviceReportController.getReports);
router.get('/progression', serviceReportController.getReportWithProgression);

module.exports = router;
