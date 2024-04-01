const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const systemUserSchema = new Schema({

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
        required: true,
        minlength: 8,
        //password encryption
    },

    userRole: {
        type: String,
        required: true,
        unique: true
    },

    isActive:{   
        type : Boolean,
        required: true
    }

}, {timestamps: true})


const SystemUser = mongoose.model("SystemUser", systemUserSchema);
module.exports = SystemUser;