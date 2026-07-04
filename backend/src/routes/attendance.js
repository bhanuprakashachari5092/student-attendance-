const express = require('express');
const {
  getAttendanceByDate,
  saveAttendance,
  getAttendanceSummary,
  getAllAttendance
} = require('../controllers/attendance');

const router = express.Router();

router
  .route('/')
  .post(saveAttendance)
  .get(getAllAttendance);

router
  .route('/:date')
  .get(getAttendanceByDate);

router
  .route('/:date/summary')
  .get(getAttendanceSummary);

module.exports = router;
