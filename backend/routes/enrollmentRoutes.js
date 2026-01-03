import express from 'express';
import {
  getEnrollments,
  getEnrollment,
  getStudentsByInstructor,
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('student'), getEnrollments);
router.get('/:courseId', protect, authorize('student'), getEnrollment);
router.get('/course/:courseId/instructor/:instructorId', protect, authorize('instructor', 'admin'), getStudentsByInstructor);

export default router;
