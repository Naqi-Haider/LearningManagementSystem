const mongoose = require('mongoose');

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
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Sections map: instructorId -> section (v1-v10)
  instructorSections: [{
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    section: {
      type: String,
      required: true,
    },
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
