const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

// router.use(protect);

router.get('/', departmentController.getDepartments);
router.get('/:id', departmentController.getDepartment);
router.get('/:id/details', departmentController.getDepartmentDetails);

router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

// Roles & Programs
router.post('/:id/roles', departmentController.addDepartmentRole);
router.delete('/:id/roles/:roleId', departmentController.deleteDepartmentRole);

router.post('/:id/programs', departmentController.addDepartmentProgram);
router.delete('/:id/programs/:programId', departmentController.deleteDepartmentProgram);

module.exports = router;
