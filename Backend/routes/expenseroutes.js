const router = require("express").Router();
let otherExpenses = require("../models/expensemodel");

router.route("/add").post((req,res)=>{
    const Expense_id = req.body.Expense_id;
    const Type = req.body.Type;
    const Date = req.body.Date;
    const Status = req.body.Status;
    const Cost = req.body.Cost;

    const newOther = new otherExpenses({
        Expense_id,
        Type,
        Date,
        Status,
        Cost
    })
    
    newOther.save().then(()=>{
        res.json("Other Expense Added")
    }).catch((err)=>{
        console.log(err);
    })
})



router.route("/").get((req,res)=>{
    otherExpenses.find().then((otherExpense)=>{
        res.json(otherExpense)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let expenseId = req.params.id;
    const {Expense_id, Type, Date, Status, Cost} = req.body;

    const updateOther = {
        Expense_id,
        Type,
        Date,
        Status,
        Cost
    }

    const update = await otherExpenses.findByIdAndUpdate(expenseId, updateOther).then(() => {
        res.status(200).send({status: "Other Expense updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating data"});
    })
})

router.route("/delete/:id").delete(async (req,res) => {
    let expenseId = req.params.id;

    await otherExpenses.findByIdAndDelete(expenseId).then(() => {
        res.status(200).send({status: "Other Expense deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting Other Expense"});
    })
})

router.route("/get/:id").get(async (req,res) => {
    let expenseId = req.params.id;
    const other = await otherExpenses.findById(expenseId).then((otherExpense) => {
        res.status(200).send({status: "Other Expense fetched", otherExpense})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with getting Other expense"});
    })
})



router.route("/:date").get((req, res) => {
    const { date } = req.params;
    const query = date ? { Date: date } : {};

    otherExpenses.find(query)
        .then((otherExpense) => {
            res.json(otherExpense);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching other expenses" });
        });
});

module.exports = router;