const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
    Expense_id: {
        type : String,
        required: true
    },
    Type: {
        type : String,
        required: true
    },
    Date:{
        type: String,
        required: true
    },
    Status:{
        type: String,
        required: true
    },
    Cost:{
        type: String,
        required: true
    }
})

const otherExpense = mongoose.model("otherExpense", otherSchema);
module.exports = otherExpense;