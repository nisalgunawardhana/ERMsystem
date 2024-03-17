const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cusSchema = new Schema({
    customer_id: {
        type : String,
        required: true
    },
    
   customer_name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    point:{
        type: Number,
        required: true
    }
    
})

const customer = mongoose.model("customer", cusSchema);
module.exports = customer;