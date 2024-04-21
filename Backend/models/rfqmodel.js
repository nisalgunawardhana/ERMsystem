const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RFQSchema = new Schema({
    rfq_id: {
        type : String,
        required: true
    },

    introduction:{
        type : String,
        required: true
    },

    quotation_items: [{
        qitem: String,
        quantity: Number,
      }],

    quality_standards:{
        type: String,
        required: true
    },
    
    pricing_terms:{
        type: String,
        required: true
    },

    delivery_requirements:{
        type: String,
        required: true
    },

    payment_terms:{
        type: String,
        required: true
    },

    deadline_for_rfq:{
        type: Date,
        required: true
    },

    submission_criteria:{
        type: String,
        required: true
    },

    additional_instructions:{
        type: String,
        required: true
    },
 

})

const rfq = mongoose.model("RFQ", RFQSchema);
module.exports = rfq;
