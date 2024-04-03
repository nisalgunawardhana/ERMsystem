const router = require("express").Router();
let rfq = require("../models/rfqmodel");


//CREATE
router.route("/add").post((req,res)=>{
    const rfq_id = req.body.rfq_id;
    const introduction = req.body.introduction;
    const quotation_items = req.body.quotation_items;
    const quality_standards = req.body.quality_standards;
    const pricing_terms = req.body.pricing_terms;
    const delivery_requirements = req.body.delivery_requirements;
    const payment_terms = req.body.payment_terms;
    const deadline_for_rfq = req.body.deadline_for_rfq;
    const submission_criteria = req.body.submission_criteria;
    const additional_instructions = req.body.additional_instructions;


    const newRFQ = new rfq({
        rfq_id,
        introduction,
        quotation_items,
        quality_standards,
        pricing_terms,
        delivery_requirements,
        payment_terms,
        deadline_for_rfq,
        submission_criteria,
        additional_instructions,
    })
    
    newRFQ.save().then(()=>{
        res.json("A new Request For Quotation added")
    }).catch((err)=>{
        console.log(err);
    })
})


//READ
router.route("/").get((req,res)=>{
    rfq.find().then((rfqmodel)=>{
        res.json(rfqmodel)
    }).catch((err)=>{
        console.log(err)
    })
})


//UPDATE
router.route("/update/:id").put(async (req,res)=>{
    let rfqID = req.params.id;
    const {rfq_id, introduction, quotation_items, quality_standards, pricing_terms, delivery_requirements, payment_terms, deadline_for_rfq, submission_criteria, additional_instructions} = req.body;

    const updateRFQ = {
        rfq_id,
        introduction,
        quotation_items,
        quality_standards,
        pricing_terms,
        delivery_requirements,
        payment_terms,
        deadline_for_rfq,
        submission_criteria,
        additional_instructions,
    }

    const update = await rfq.findByIdAndUpdate(rfqID, updateRFQ).then(() => {
        res.status(200).send({status: "RFQ details updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating RFQ details"});
    })
})


//DELETE
router.route("/delete/:id").delete(async (req,res) => {
    let rfqID = req.params.id;

    await rfq.findByIdAndDelete(rfqID).then(() => {
        res.status(200).send({status: "RFQ deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting RFQ details"});
    })
})


//GET ONE SUPPLIER
router.route("/get/:id").get(async (req,res) => {
    let rfqID = req.params.id;
    const rfqss = await rfq.findById(rfqID)
    .then((rfqq) => {
        res.status(200).send({status: "RFQ fetched", rfqq})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with getting RFQ detials", error: err.message});
    })
})

module.exports = router;
