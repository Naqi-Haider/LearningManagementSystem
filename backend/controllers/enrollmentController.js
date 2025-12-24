const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get student enrollments
// @route   GET /api/enrollments
// @access  Student only
const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId', 'title description code');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrollment details
// @route   GET /api/enrollments/:courseId
// @access  Student only
const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: req.params.courseId,
    }).populate('courseId completedLessons');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEnrollments,
  getEnrollment,
};
