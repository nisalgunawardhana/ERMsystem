const express = require('express')

const router = express.Router()

//GET all users
router.get('/', (req, res) => {
    res.json({mssg: 'GET all users'})
})

//GET a single user
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single user'})
})

//POST a new user
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new user'})
})

//DELETE a user
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a user'})
})

//UPDATE a user
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a user'})
})
module.exports = router