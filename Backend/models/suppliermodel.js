const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
    supplier_id: {
        type : String,
        required: true
    },
    
    supplier_name:{
        type: String,
        required: true
    },

    address:{
        type: String,
        required: true
    },

    contact:{
        type: Number,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    product_types:{
        type: [String],
        required: true
    },

    product_items: [{
        product_name: String,
        unit_price: Number
    }],

    bank_details:{
        bank: String,
        branch: String,
        acc_no: Number,
        payment_method: String,
        payment_terms:String
    },
    
    sup_performance:{
        quality:String,
        delivery_time: String
    },

    contract:{
        start_date: Date,
        end_date:Date,
    }

})

const suppliers = mongoose.model("suppliers", SupplierSchema);
module.exports = suppliers;
