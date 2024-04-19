const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel');

// Route to get all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new notes
router.post('/notes', async (req, res) => {
    const note = new Note({
        note_no: req.body.note_no,
        note_title: req.body.note_title,
        note_description: req.body.note_description,
        date: req.body.date
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get a single note by ID
router.get('/notes/:id', getNote, (req, res) => {
    res.json(res.note);
});

// Route to update a note
router.patch('/notes/:id', getNote, async (req, res) => {
    if (req.body.note_no != null) {
        res.task.note_no = req.body.note_no;
    }
    if (req.body.note_title != null) {
        res.task.note_title = req.body.note_title;
    }
    if (req.body.note_description != null) {
        res.task.note_description = req.body.note_description;
    }
    if (req.body.date != null) {
        res.task.date = req.body.date;
    }

    try {
        const updatedNote = await res.note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a task
router.delete('/notes/:id', getNote, async (req, res) => {
    try {
        await res.note.remove();
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function to get a single note by ID
async function getNote(req, res, next) {
    let note;
    try {
        note = await Note.findById(req.params.id);
        if (note == null) {
            return res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.note = note;
    next();
}

module.exports = router;
