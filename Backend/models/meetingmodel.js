const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({

    meeting_id: {
        type: String,
        required: true,
        unique: true
      },

    trainee_name: {
        first: {
          type: String,
          required: true
        },
        last: {
          type: String,
          required: true
        }
      },

    trainee_gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
      },

    trainee_contact: {
        type: String,
        required: true
      },

    trainee_rating: {
        type: Number,
        required: true
    } 
    
})

const meeting = mongoose.model("meeting", MeetingSchema);
module.exports = meeting;
