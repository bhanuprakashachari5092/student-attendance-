const Marks = require('../models/Marks');

// @desc    Get all marks history
// @route   GET /api/v1/marks
// @access  Public
exports.getMarksHistory = async (req, res) => {
  try {
    const marks = await Marks.find().sort('-date'); // Sort by newest
    res.status(200).json({ success: true, count: marks.length, data: marks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add new marks entry
// @route   POST /api/v1/marks
// @access  Public
exports.addMarksEntry = async (req, res) => {
  try {
    const entry = await Marks.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get marks for specific student
// @route   GET /api/v1/marks/student/:studentId
// @access  Public
exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId }).sort('-date');
    res.status(200).json({ success: true, count: marks.length, data: marks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete marks entry
// @route   DELETE /api/v1/marks/:id
// @access  Public
exports.deleteMarksEntry = async (req, res) => {
    try {
        const entry = await Marks.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ success: false, error: 'Marks entry not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
