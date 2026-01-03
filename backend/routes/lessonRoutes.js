import express from 'express';
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:courseId', protect, getLessons);
router.post('/', protect, authorize('instructor', 'admin'), createLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);
router.put('/:id/complete', protect, authorize('student'), completeLesson);

export default router;
