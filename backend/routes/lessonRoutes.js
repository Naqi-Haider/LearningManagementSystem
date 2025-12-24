const express = require('express');
const {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:courseId', protect, getLessons);
router.post('/', protect, authorize('instructor', 'admin'), createLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);
router.put('/:id/complete', protect, authorize('student'), completeLesson);

module.exports = router;
