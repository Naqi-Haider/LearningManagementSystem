const express = require('express');
const { getAllUsers, getUsersByRole, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/role/:role', protect, authorize('admin'), getUsersByRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
