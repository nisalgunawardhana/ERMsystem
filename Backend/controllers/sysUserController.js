const SystemUser = require('../models/userModel')
const mongoose = require('mongoose')

//get all users
const getUsers = async (req, res) => {
    const users = await SystemUser.find({}).sort({createdAt: -1})   //-1 --> descending order of creation

    //res.status(200) --> the request was successful
    res.status(200).json(users)
}

//get a single user
const getUser = async (req, res) => {
    const { id } = req.params

    //checks if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const user = await SystemUser.findById(id)

    if (!user) {
        //res.status(404) --> cannot be found
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}

//create a new user
const createUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body

    //add doc to db
    try{
        const sysUser = await SystemUser.create({ first_name, last_name, email, password })
        res.status(200).json(sysUser)
    }catch (error){
        res.status(400).json({error: error.message})
    }
}

//delete a user
const deletUser = async (req, res) => {
    const { id } = req.params

    //checks if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const user = await SystemUser.findOneAndDelete({_id: id})

    if (!user) {
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}

//update a user
const updateUser = async (req, res) => {
    const { id } = req.params

    //checks if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const user = await SystemUser.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!user) {
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}


module.exports = {
    getUsers,
    getUser,
    createUser,
    deletUser,
    updateUser
}