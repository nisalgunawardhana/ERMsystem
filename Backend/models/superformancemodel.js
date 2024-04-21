const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupplierPerformanceSchema = new Schema({

    po_id: {
        type: String,
        required: true
    },

    purchaseOrder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchaseOrder',
        required: true
    },
    
    sup_id: {
        type: String,
        required: true
    },

    sup_deliver_date: {
        type: Date,
        required: true
    },

    leadTime: {
        type: String,
        required: true
    },

    qualityOfGoods: {
        type: Number,
        required: true
    },

    quantityAccuracy: {
        type: Number,
        required: true
    },

    responsiveness: {
        type: String,
        required: true
    },

    costEffectiveness: {
        type: Number,
        required: true
    }
    
})

const supPerformance = mongoose.model("supPerformance", SupplierPerformanceSchema);
module.exports = supPerformance;
