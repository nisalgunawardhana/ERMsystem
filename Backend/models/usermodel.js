const mongoose = require("mongoose")

const Schema = mongoose.Schema

const systemUserSchema = new Schema({
    
    first_name:{
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
        minlength: 8,
    }/*,

    userRole: {
        type: String,
        required: true,
        unique: true
    },

    isActive:{   
        type : Boolean,
        required: true
    }*/

}, {timestamps: true})

module.exports = mongoose.model("SystemUser", systemUserSchema)
