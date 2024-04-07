const express = require('express')
const {
    getUsers,
    getUser,
    createUser,
    deletUser,
    updateUser
} = require('../controllers/sysUserController')

const router = express.Router()

//to GET all the users
router.get('/', getUsers)

//to GET a single user
router.get('/:id', getUser)

//to POST a new user
router.post('/', createUser)

//to DELETE a user
router.delete('/:id', deletUser)

//to UPDATE a user
router.patch('/:id', updateUser)

module.exports = router
