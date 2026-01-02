const mongoose = require('mongoose');

const instructorSectionSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  instructorLimit: {
    type: Number,
    default: 1,
  },
  instructorSections: [instructorSectionSchema],
  // Keep instructors array for backward compatibility
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
