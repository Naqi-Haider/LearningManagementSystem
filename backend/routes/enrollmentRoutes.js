const express = require('express');
const {
  getEnrollments,
  getEnrollment,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('student'), getEnrollments);
router.get('/:courseId', protect, authorize('student'), getEnrollment);

module.exports = router;
