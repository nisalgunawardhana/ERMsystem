const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the category enum
const CategoryEnum = ["8+", "12+", "16+", "18+"];

const stockSchema = new Schema({
    item_code: {
        type : String,
        required: true
    },
    
    item_name:{
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: CategoryEnum,
        required: true  
    },

    price:{
        type: Number,
        required: true
    },
    
    quantity:{
        type: Number,   
        required: true
    },

    alert_quantity:{
        type: Number,
        required: true
    }
    
})

const toys = mongoose.model("toys", stockSchema);
module.exports = toys;
