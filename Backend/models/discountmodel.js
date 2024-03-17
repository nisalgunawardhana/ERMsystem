const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
    Rule_name: {
        type : String,
        required: true
    },
    
    Create_date:{
        type: Date,
        required: true
    },

    Discount_presentage:{
        type: Number,   
        required: true
        
      },
    
    rule_con:{
        type: Number,   
        required: true
    }
    
})

const discounts = mongoose.model("discounts", DiscountSchema);
module.exports = discounts;
