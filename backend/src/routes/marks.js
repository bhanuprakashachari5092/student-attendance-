const express = require('express');
const {
  getMarksHistory,
  addMarksEntry,
  getMarksByStudent,
  deleteMarksEntry
} = require('../controllers/marks');

const router = express.Router();

router
  .route('/')
  .get(getMarksHistory)
  .post(addMarksEntry);

router
  .route('/:id')
  .delete(deleteMarksEntry);

router
  .route('/student/:studentId')
  .get(getMarksByStudent);

module.exports = router;
