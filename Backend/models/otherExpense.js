const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
    Type: {
        type : String,
        required: true
    },
    Date:{
        type: Date,
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