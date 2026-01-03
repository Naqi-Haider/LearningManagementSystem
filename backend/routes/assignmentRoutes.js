import express from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:courseId', protect, getAssignments);
router.post('/', protect, authorize('instructor'), createAssignment);
router.put('/:id', protect, authorize('instructor'), updateAssignment);
router.delete('/:id', protect, authorize('instructor'), deleteAssignment);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);
router.get('/:id/submissions', protect, authorize('instructor'), getSubmissions);

export default router;
