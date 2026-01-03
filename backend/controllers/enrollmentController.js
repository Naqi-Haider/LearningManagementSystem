import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

//Read Request: ALL ENROLLMENTS
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId', 'title description code')
      .populate('instructorId', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Read Request: SINGLE ENROLLMENT
export const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: req.params.courseId,
    })
      .populate('courseId')
      .populate('completedLessons')
      .populate('instructorId', 'name email');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Read Request: ALL STUDENTS ENROLLED WITH A SPECIFIC INSTRUCTOR FOR A COURSE
export const getStudentsByInstructor = async (req, res) => {
  try {
    const { courseId, instructorId } = req.params;

    const enrollments = await Enrollment.find({
      courseId,
      instructorId
    }).populate('studentId', 'name email profileImage');

    const students = enrollments.map(e => e.studentId);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
