import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  joinCourse,
  enrollCourse,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.put('/:id/join', protect, authorize('instructor'), joinCourse);
router.put('/:id/enroll', protect, authorize('student'), enrollCourse);

export default router;
