const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
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
        type: String,
        required: true
    },
    Status:{
        type: String,
        required: true
    },
    Epf:{
        type: Number,
        required: true
    },
    Total_tax:{
        type: Number,
        required: true
    }
})

const tax = mongoose.model("tax", otherSchema);
module.exports = tax;