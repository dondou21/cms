const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', memberController.getMembers);
router.get('/:id', memberController.getMember);

router.post('/', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), memberController.createMember);
router.put('/:id', authorize('Admin', 'Pastor/Leader', 'Secretary/Clerk'), memberController.updateMember);
router.delete('/:id', authorize('Admin'), memberController.deleteMember);

module.exports = router;
