// attendanceModel.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  employee_Id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
