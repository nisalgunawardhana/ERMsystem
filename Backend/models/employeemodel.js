const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmpSchema = new Schema({
    employee_Id:{
        type : String,
        required: true
    },
    
    name:[{
        FirstName: String,
        LastName: String
    }],

    employee_NIC:{
        type: Number,
        required: true
    },
    
    employee_Contact:{
        type: Number,
        required: true
    },

    employee_Email:{
        type: String,
        required: true
    },
    
})

const employees = mongoose.model("employees", EmpSchema);
module.exports = employees;
