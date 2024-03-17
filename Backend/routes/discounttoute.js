const router = require("express").Router();
let discounts = require("../models/discountmodel");

router.route("/add").post((req,res)=>{
    const Rule_name = req.body.Rule_name;
    const Create_date = req.body.Create_date;
    const Discount_presentage = req.body.Discount_presentage;
    const rule_con = req.body.rule_con;

    const newdiscount = new discounts({
        Rule_name,
        Create_date,
        Discount_presentage,
        rule_con
    })
    
    newdiscount.save().then(()=>{
        res.json("New discount rule Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    discounts.find().then((discountmodel)=>{
        res.json(discountmodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(async (req,res)=>{
    let disID = req.params.id;
    const {Rule_name, Create_date, Discount_presentage, rule_con} = req.body;

    const updateDiscount = {
        Rule_name,
        Create_date,
        Discount_presentage,
        rule_con
    }

    const update = await discounts.findByIdAndUpdate(disID, updateDiscount).then(() => {
        res.status(200).send({status: "Discount rule updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Discount rule"});
    })
})

router.route("/delete/:id").delete(async (req,res) => {
    let disID = req.params.id;

    await discounts.findByIdAndDelete(disID).then(() => {
        res.status(200).send({status: "Discount rule deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting Discount rule"});
    })
})





module.exports = router;
