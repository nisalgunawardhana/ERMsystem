const router = require("express").Router();
let tax = require("../models/tax");

router.route("/add").post((req,res)=>{
    const Taxable_income = Number(req.body.Taxable_income);
    const Rate = Number(req.body.Rate);
    const Income_tax = Number(req.body.Income_tax);
    const Due_date = req.body.Due_date;
    const Status = req.body.Status;
    const Epf = Number(req.body.Epf);
    const Total_tax = Number(req.body.Total_tax);

    const newTax = new tax({
        Taxable_income,
        Rate,
        Income_tax,
        Due_date,
        Status,
        Epf,
        Total_tax
    })
    
    newTax.save().then(()=>{
        res.json("Tax Details Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    tax.find().then((tax)=>{
        res.json(tax)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let taxId = req.params.id;
    const { Taxable_income,Rate,Income_tax,Due_date,Status,Epf,Total_tax} = req.body;

    const updateTax = {
        Taxable_income,
        Rate,
        Income_tax,
        Due_date,
        Status,
        Epf,
        Total_tax
    }

    const update = await tax.findByIdAndUpdate(taxId, updateTax).then(() => {
        res.status(200).send({status: "Tax report updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating data"});
    })
})

router.route("/get/:id").get(async (req,res) => {
    let taxId = req.params.id;
    const tax = await otherExpenses.findById(taxId).then((tax) => {
        res.status(200).send({status: "Tax report fetched", tax})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with getting Tax report"});
    })
})

module.exports = router;