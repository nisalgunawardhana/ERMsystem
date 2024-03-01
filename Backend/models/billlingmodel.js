const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new Schema({
    customer_id: {
        type : String,
        required: true
    },
    
    billing_date:{
        type: Date,
        required: true
    },

    items: [{
        quantity: Number,
        unit_price: Number
      }],
    
    total_amount:{
        type: Number,
        required: true
    }
    
})

const bills = mongoose.model("bills", BillSchema);
module.exports = bills;
