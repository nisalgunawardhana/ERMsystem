const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    item_id: {
        type : String,
        required: true
    },
    
    price:{
        type: Number,
        required: true
    }
    
})

const items = mongoose.model("items", itemSchema);
module.exports = items;
