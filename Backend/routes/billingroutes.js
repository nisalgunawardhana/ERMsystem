const router = require("express").Router();
let bills = require("../models/billlingmodel");

router.route("/add").post((req,res)=>{
    const customer_id = req.body.customer_id;
    const billing_date = req.body.billing_date;
    const items = req.body.items;
    const total_amount = req.body.total_amount;

    const newBill = new bills({
        customer_id,
        billing_date,
        items,
        total_amount
    })
    
    newBill.save().then(()=>{
        res.json("New bills Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    bills.find().then((billlingmodel)=>{
        res.json(billlingmodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let billsId = req.params.id;
    const {customer_id, billing_date, items, total_amount} = req.body;

    const updateBills = {
        customer_id,
        billing_date,
        items,
        total_amount
    }

    const update = await bills.findByIdAndUpdate(billsId, updateBills).then(() => {
        res.status(200).send({status: "Bills updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Bills"});
    })
})

router.route("/delete/:id").delete(async (req,res) => {
    let billsId = req.params.id;

    await bills.findByIdAndDelete(billsId).then(() => {
        res.status(200).send({status: "Bill deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting bill"});
    })
})

router.route("/:id").get((req, res) => {
    const billId = req.params.id;

    bills.findById(billId).then((billModel) => {
        if (!billModel) {
            return res.status(404).json({ error: "Bill not found" });
        }
        res.json(billModel);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Failed to retrieve bill" });
    });
});





module.exports = router;
