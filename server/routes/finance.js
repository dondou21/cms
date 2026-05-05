const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

router.post('/', financeController.createReport);
router.get('/', financeController.getReports);
router.get('/:id', financeController.getReport);

module.exports = router;
