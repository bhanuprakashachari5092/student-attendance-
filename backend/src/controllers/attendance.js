const Attendance = require('../models/Attendance');

// @desc    Get attendance for a specific date
// @route   GET /api/v1/attendance/:date
// @access  Public
exports.getAttendanceByDate = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ date: req.params.date });
    if (!attendance) {
      return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json({ success: true, data: attendance.records });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Save attendance for a specific date
// @route   POST /api/v1/attendance
// @access  Public
exports.saveAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    
    // Check if record for this date exists. If so, update it. If not, create it.
    let attendance = await Attendance.findOne({ date });

    if (attendance) {
      attendance.records = records;
      attendance = await attendance.save();
    } else {
      attendance = await Attendance.create({ date, records });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get summary for a date
// @route   GET /api/v1/attendance/:date/summary
// @access  Public
exports.getAttendanceSummary = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ date: req.params.date });
    let summary = { present: 0, absent: 0, holiday: 0 };
    
    if (attendance) {
        summary = attendance.records.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, { present: 0, absent: 0, holiday: 0 });
    }
    
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all attendance records (for reports)
// @route   GET /api/v1/attendance
// @access  Public
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find().sort({ date: -1 });
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
