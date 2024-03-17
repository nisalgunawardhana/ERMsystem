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

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
