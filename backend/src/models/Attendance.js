const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true, // format: YYYY-MM-DD
  },
  records: [{
    studentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'holiday'],
      default: 'present'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound unique index so we only have one attendance document per date
AttendanceSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
