const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructors', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructors', 'name email')
      .populate('students', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Admin only
const createCourse = async (req, res) => {
  try {
    const { title, description, code, instructorLimit } = req.body;

    const courseExists = await Course.findOne({ code });
    if (courseExists) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    const course = await Course.create({
      title,
      description,
      code,
      instructorLimit: instructorLimit || 1,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin only
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin only
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Instructor joins course
// @route   PUT /api/courses/:id/join
// @access  Instructor only
const joinCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructors.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already teaching this course' });
    }

    if (course.instructors.length >= course.instructorLimit) {
      return res.status(400).json({ message: 'Capacity Reached' });
    }

    course.instructors.push(req.user._id);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Student enrolls in course
// @route   PUT /api/courses/:id/enroll
// @access  Student only
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: req.params.id,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.students.push(req.user._id);
    await course.save();

    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId: req.params.id,
    });

    res.json({ course, enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  joinCourse,
  enrollCourse,
};
