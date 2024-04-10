const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
    Profit_ID: {
        type : String,
        required: true
    },
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
    Other_expenses: {
        type : Number,
        required: true
    },
    EPF_ETF: {
        type : Number,
        required: true
    },
    Monthly_profit:{
        type: Number,
        required: true
    },
    Date_created: {
        type : Date,
        required: true
    },
    Description: {
        type : String,
        required: true
    }
    
})

const profit = mongoose.model("profit", otherSchema);
module.exports = profit;