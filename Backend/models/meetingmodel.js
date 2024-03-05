const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({

    meeting_id: {
        type: String,
        required: true,
        unique: true
      },

    meeting_name: {
        type: String,
        required: true,
      },

    meeting_start: {
        type: Number,
        required: true
      },

    meeting_end: {
        type: Number,
        required: true
      },

    meeting_date: {
        type: String,
        required: true
      },

    meeting_location: {
        type: String,
        required: true
    } 
    
})

const meeting = mongoose.model("meeting", MeetingSchema);
module.exports = meeting;
