import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

//Read Request:
export const getAssignments = async (req, res) => {
  try {
    const query = { courseId: req.params.courseId };

    // Filter by instructor if provided
    if (req.query.instructor) {
      query.createdBy = req.query.instructor;
    }

    const assignments = await Assignment.find(query)
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create Request:
export const createAssignment = async (req, res) => {
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

//Update Request:
//PUT api: /assignments/:id
export const updateAssignment = async (req, res) => {
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

//Delete Request:
//DELETE api: /assignments/:id
export const deleteAssignment = async (req, res) => {
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

//Create Request:
//POST api: /assignments/:id/submit
export const submitAssignment = async (req, res) => {
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

//Read Request:
//GET api: /assignments/:id/submissions
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('studentId', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
