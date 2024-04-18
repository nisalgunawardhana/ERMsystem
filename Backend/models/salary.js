const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salarySchema = new Schema({
    Emp_id: {
        type : String,
        required: true
    },
    Salary: {
        type : Number,
        required: true
    },
    Date: {
        type : Date,
        required: true
    }
})

const salary = mongoose.model("salary", salarySchema);
module.exports = salary;