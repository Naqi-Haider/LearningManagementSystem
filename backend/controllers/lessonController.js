const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @desc    Get lessons for a course (optionally filter by instructor)
// @route   GET /api/lessons/:courseId?instructor=instructorId
// @access  Private
const getLessons = async (req, res) => {
  try {
    const query = { courseId: req.params.courseId };

    // Filter by instructor if provided
    if (req.query.instructor) {
      query.instructor = req.query.instructor;
    }

    const lessons = await Lesson.find(query)
      .sort('sequenceOrder')
      .populate('instructor', 'name email');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Instructor only
const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, sequenceOrder } = req.body;

    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      sequenceOrder,
      instructor: req.user._id,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Instructor (owner only)
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Only the instructor who created it can update
    if (lesson.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
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
// @access  Instructor (owner only)
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Only the instructor who created it can delete
    if (lesson.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this lesson' });
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

      // Calculate progress based on instructor's lessons only
      const totalLessons = await Lesson.countDocuments({
        courseId,
        instructor: enrollment.instructorId
      });
      enrollment.progress = totalLessons > 0 ? (enrollment.completedLessons.length / totalLessons) * 100 : 0;

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
