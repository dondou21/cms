const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', departmentController.getDepartments);
router.get('/:id', departmentController.getDepartment);
router.get('/:id/members', departmentController.getDepartmentMembers);

router.post('/', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), departmentController.createDepartment);
router.put('/:id', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), departmentController.updateDepartment);
router.delete('/:id', authorize('Admin'), departmentController.deleteDepartment);

module.exports = router;
