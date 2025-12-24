const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  joinCourse,
  enrollCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.put('/:id/join', protect, authorize('instructor'), joinCourse);
router.put('/:id/enroll', protect, authorize('student'), enrollCourse);

module.exports = router;
