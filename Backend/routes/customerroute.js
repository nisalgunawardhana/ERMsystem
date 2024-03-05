const router = require("express").Router();
let customer = require("../models/coustomermodel");

router.route("/add").post((req,res)=>{
    const customer_id = req.body.customer_id;
    const customer_name = req.body.customer_name;
    const email = req.body.email;
    const point = req.body.point;

    const newCustomer = new customer({
        customer_id,
        customer_name,
        email,
        point
    })
    
    newCustomer.save().then(()=>{
        res.json("New Customer Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    customer.find().then((customermodel)=>{
        res.json(customermodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:customer_id").put(async (req,res)=>{
    let cus_id = req.params.customer_id;
    const {customer_id, customer_name, email, point} = req.body;

    const updatecustomer = {
        customer_id,
        customer_name,
        email,
        point
    }

    const update = await customer.findByIdAndUpdate(cus_id, updatecustomer).then(() => {
        res.status(200).send({status: "Customer Details updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with Updating Details"});
    })
})

router.route("/delete/:customer_id").delete(async (req,res) => {
    let cus_id = req.params.id;

    await customer.findByIdAndDelete(cus_id).then(() => {
        res.status(200).send({status: "Customer deleted"});
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with deleting customer"});
    })
})

module.exports = router;
