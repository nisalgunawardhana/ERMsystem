const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const systemUserSchema = new Schema({

    userId: {
        type : Number,
        required: true,
        unique: true
    },

    empId: {
        type : Number,
        required: true,
        unique: true
    },
    
    first_name:{
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },
    
    nic:{
        type: String,
        required: true,
        unique: true
    },

    username:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        minlength: 8,
        //password encryption
    },

    userRole: {
        type: String,
        ref: "UserRole",
        unique: true
    },

    isActive:{   
        type : Boolean,
        required: true
    },

    createdDate: {
        type : Date,
        default: Date.now
    }
    
})

const SystemUser = mongoose.model("SystemUser", systemUserSchema);
module.exports = SystemUser;
