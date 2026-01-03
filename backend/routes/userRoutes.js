import express from 'express';
import { getAllUsers, getUsersByRole, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/role/:role', protect, authorize('admin'), getUsersByRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
