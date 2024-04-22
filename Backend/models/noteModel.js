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
    }
    ,
}, {
    timestamps: true
})

const Note = mongoose.model('notes', noteSchema);

module.exports = Note;
