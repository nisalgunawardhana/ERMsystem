const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TraineeSchema = new Schema({

    trainee_id: {
        type: String,
        required: true,
        unique: true
    },

    trainee_name: {
      type: String,
      required: true
    },

    trainee_email: {
        type: String,
        required: true
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

const trainee = mongoose.model("trainee", TraineeSchema);
module.exports = trainee;
