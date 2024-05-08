// routes/reports.js
const express = require('express');
const router = express.Router();
const Report = require('../models/report');

// Create a new report
router.post('/', (req, res) => {
  const { startDate, endDate, content } = req.body;
  const newReport = new Report({
    startDate: startDate,
    endDate: endDate,
    content: content,
  });
  newReport.save()
    .then(report => res.json(report))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Fetch all reports
router.get('/', (req, res) => {
  Report.find()
    .then(reports => res.json(reports))
    .catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
