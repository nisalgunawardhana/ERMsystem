const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
    Tax_ID: {
        type : String,
        required: true
    },
    Taxable_income: {
        type : Number,
        required: true
    },
    Rate:{
        type: Number,
        required: true
    },
    Income_tax:{
        type: Number,
        required: true
    },
    Due_date:{
        type: Date,
        required: true
    },
    Date_modified: {
        type : Date,
        required: true
    },
    Status:{
        type: String,
        required: true
    },
    Final_profit:{
        type: Number,
        required: true
    }
})

const tax = mongoose.model("tax", otherSchema);
module.exports = tax;