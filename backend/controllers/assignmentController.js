const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Get assignments for a course
// @route   GET /api/assignments/:courseId
// @access  Private
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ courseId: req.params.courseId })
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Instructor only
const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate } = req.body;

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Instructor only
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Instructor only
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Student only
const submitAssignment = async (req, res) => {
  try {
    const { content } = req.body;

    const existingSubmission = await Submission.findOne({
      assignmentId: req.params.id,
      studentId: req.user._id,
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const submission = await Submission.create({
      assignmentId: req.params.id,
      studentId: req.user._id,
      content,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Instructor only
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('studentId', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
};
