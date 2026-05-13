const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authorize } = require('../middleware/auth');

// Only Admins can manage users
router.get('/', authorize(['Admin']), userController.getAllUsers);
router.patch('/:id/role', authorize(['Admin']), userController.updateUserRole);

module.exports = router;
