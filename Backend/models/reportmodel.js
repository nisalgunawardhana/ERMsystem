const mongoose = require('mongoose');

// Define schema for reports
const reportSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  content: String,
});

// Create a model based on the schema
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
