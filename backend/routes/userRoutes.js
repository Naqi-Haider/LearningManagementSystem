import express from 'express';
import { getAllUsers, getUsersByRole, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/role/:role', protect, authorize('admin'), getUsersByRole);
router.get('/:id', protect, authorize('admin'), getUser);
router.post('/', protect, authorize('admin'), createUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
