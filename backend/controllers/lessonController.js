const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @desc    Get lessons for a course
// @route   GET /api/lessons/:courseId
// @access  Private
const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort('sequenceOrder');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Instructor/Admin
const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, sequenceOrder } = req.body;

    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      sequenceOrder,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Instructor/Admin
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Instructor/Admin
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark lesson as complete
// @route   PUT /api/lessons/:id/complete
// @access  Student
const completeLesson = async (req, res) => {
  try {
    const { courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (!enrollment.completedLessons.includes(req.params.id)) {
      enrollment.completedLessons.push(req.params.id);

      // Calculate progress
      const totalLessons = await Lesson.countDocuments({ courseId });
      enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;

      await enrollment.save();
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
};
