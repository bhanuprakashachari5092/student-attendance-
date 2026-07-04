const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String, // Stored for easier retrieval
    required: true
  },
  testName: {
    type: String,
    required: [true, 'Please add a test name']
  },
  date: {
    type: String,
    required: true, // format: YYYY-MM-DD
    default: () => new Date().toISOString().split('T')[0]
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  marks: {
    Maths: { type: String, default: "" },
    Science: { type: String, default: "" },
    English: { type: String, default: "" },
    Social: { type: String, default: "" }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Marks', MarksSchema);
