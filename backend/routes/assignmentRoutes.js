const express = require('express');
const {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:courseId', protect, getAssignments);
router.post('/', protect, authorize('instructor'), createAssignment);
router.put('/:id', protect, authorize('instructor'), updateAssignment);
router.delete('/:id', protect, authorize('instructor'), deleteAssignment);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);
router.get('/:id/submissions', protect, authorize('instructor'), getSubmissions);

module.exports = router;
