const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({

    note_no: {
        type: String,
        required: true,
        unique: true 
    },
    note_title: {
        type: String,
        required: true
    },
    note_description: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    date_created: {
        type: Date,
        default: Date.now // Sets the default value to the current date and time
    },
    completed: {
        type: Boolean,
        default: false // Sets the default value for the checkbox to false (unchecked)
    }
});

const Note = mongoose.model('notes', noteSchema);

module.exports = Note;
