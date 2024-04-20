const express = require('express')
const router = express.Router()
const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/authMiddleware")
const Note = require('../models/noteModel');


//--system users--
//register - CREATE
router.post('/register', async(req, res) => {
    try{
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res
            .status(200)
            .send({ message: "User already exists", success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newuser = new User(req.body)
        await newuser.save()
        //res.status(200) -- success 
        res.status(200).send({ message: "User created successfully", success: true })
    }catch (error) {
        console.log(error)
        //res.status(500) -- something unexpected happen
        res.status(500).send({ message: "Error creating user", success: false, error })
    }
})

//login - VERIFICATION
router.post('/login', async(req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res
            .status(200)
            .send({ message: "User does not exist", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch){
            return res
            .status(200)
            .send({ message: "Password is incorrect", success: false })
        } else {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })
            res
                .status(200)
                .send({ message: "Login successful", success: true, data: token })
        }
    }catch (error) {
        console.log(error)
        res
            .status(500)
            .send({ message: "Error logging in", success: false, error })
    }
})

//READ BY USER ID
router.post('/get-user-info-by-id', authMiddleware, async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        user.password =  undefined; //so that password wont be displayed
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false })
        } else {
            res.status(200).send({ 
                success: true, 
                data: user/*{
                   first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                } ,*/
            });
        }
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting user info", success: false, error })
    }
})

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a user
router.delete('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user by ID
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUserData = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user", error });
    }
});

// Route to delete multiple users
router.delete('/delete-multiple', async (req, res) => {
    try {
        const { userIds } = req.body;
        await User.deleteMany({ _id: { $in: userIds } });
        res.json({ message: 'Selected users deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting selected users", error });
    }
});




//--notes--
// to get all notes
router.get('/read-all', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// to create a new notes
router.post('/add', async (req, res) => {
    const note = new Note({
        note_no: req.body.note_no,
        note_title: req.body.note_title,
        note_description: req.body.note_description
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// to get a single note by ID
router.get('/read-one/:id', getNote, (req, res) => {
    res.json(res.note);
});

// update a note
router.patch('/update/:id', getNote, async (req, res) => {
    if (req.body.note_no != null) {
        res.task.note_no = req.body.note_no;
    }
    if (req.body.note_title != null) {
        res.task.note_title = req.body.note_title;
    }
    if (req.body.note_description != null) {
        res.task.note_description = req.body.note_description;
    }

    try {
        const updatedNote = await res.note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// to delete a note
router.delete('/delete/:id', getNote, async (req, res) => {
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
  