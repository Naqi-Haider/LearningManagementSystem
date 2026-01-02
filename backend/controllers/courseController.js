const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

//Read Request:
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructors', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Read Request: SINGLE COURSE
//GET api: /courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructors', 'name email')
      .populate('students', 'name email')
      .populate('instructorSections.instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create Request: NEW COURSE
//POST api: /courses
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

//Update Request:
//PUT api: /courses/:id
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

//Delete Request:
//DELETE api: /courses/:id
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

//Instructor joins course
//PUT api: /courses/:id/join
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

    // Assign a random unique section (v1-v10)
    const allSections = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10'];
    const usedSections = course.instructorSections?.map(s => s.section) || [];
    const availableSections = allSections.filter(s => !usedSections.includes(s));

    if (availableSections.length === 0) {
      return res.status(400).json({ message: 'No available sections' });
    }

    const randomSection = availableSections[Math.floor(Math.random() * availableSections.length)];

    course.instructors.push(req.user._id);
    if (!course.instructorSections) {
      course.instructorSections = [];
    }
    course.instructorSections.push({
      instructor: req.user._id,
      section: randomSection,
    });
    await course.save();

    res.json({ ...course.toObject(), assignedSection: randomSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Student enrolls in course with specific instructor
//PUT api: /courses/:id/enroll
const enrollCourse = async (req, res) => {
  try {
    const { instructorId } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!instructorId) {
      return res.status(400).json({ message: 'Please select an instructor' });
    }

    // Check if the instructor is actually teaching this course
    if (!course.instructors.includes(instructorId)) {
      return res.status(400).json({ message: 'Invalid instructor for this course' });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: req.params.id,
      instructorId: instructorId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled with this instructor' });
    }

    course.students.push(req.user._id);
    await course.save();

    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId: req.params.id,
      instructorId: instructorId,
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
