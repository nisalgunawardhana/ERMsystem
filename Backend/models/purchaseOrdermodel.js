const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({

    purchaseOrder_id: {
        type : String,
        required: true
    },

    supplier_id:{
        type: String,
        required: true
    },
    
    supplier_name:{
        type: String,
        required: true
    },

    order_date:{
        type: Date,
        required: true
    },

    deliver_date:{
        type:Date,
        required: true
    },

    order_items:[{
        item_name: String,
        quantity: Number,
        unit_price: Number,
        description: String,
        total_price: Number
    }],
    
    order_amount:{
        type: Number,
        required: true
    },

    delivery_information:{
        delivery_method: String,
        delivery_costs: Number
    },

    payment_information:{
        payment_terms: String,
        payment_method: String
    },

    additional_infomation:{
        type: String,
        required: true
    },

    invoice_no:{
        type: Number
    },

    total_order_amount:{
        type:Number,
        required: true
    },

    order_status:{
        type: String,
        required: true
    },

    payment_status:{
        type:String,
        required: true
    }

})

const purchaseOrder = mongoose.model("PO", PurchaseOrderSchema);
module.exports = purchaseOrder;
