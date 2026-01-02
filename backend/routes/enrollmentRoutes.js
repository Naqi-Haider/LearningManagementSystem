const express = require('express');
const {
  getEnrollments,
  getEnrollment,
  getStudentsByInstructor,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('student'), getEnrollments);
router.get('/:courseId', protect, authorize('student'), getEnrollment);
router.get('/course/:courseId/instructor/:instructorId', protect, authorize('instructor', 'admin'), getStudentsByInstructor);

module.exports = router;
