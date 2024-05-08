//leavemodel.js


const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const LeavSchema = new Schema({

    employee_Id: {
        type :String,
        required : true
    },

    fromdate : {
        type : String,
        required : true
    },

    todate : {
        type : String,
        required : true
    },
    desription : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : "Pending"
    }
},{
    timestamps :true
})

const Leaves = mongoose.model('leavesreq' , LeavSchema)

module.exports= Leaves;
