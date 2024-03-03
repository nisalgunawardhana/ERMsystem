const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
    Month: {
        type : String,
        required: true
    },
    Sales_income: {
        type : Number,
        required: true
    },
    Supplier_expenses:{
        type: Number,
        required: true
    },
    Salaries:{
        type: Number,
        required: true
    },
    Profit:{
        type: Number,
        required: true
    }
})

const profit = mongoose.model("profit", otherSchema);
module.exports = profit;