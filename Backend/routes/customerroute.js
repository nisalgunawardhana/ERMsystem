const router = require("express").Router();
let customer = require("../models/coustomermodel");

router.route("/add").post((req,res)=>{
    const customer_id = req.body.customer_id;
    const customer_name = req.body.customer_name;
    const email = req.body.email;
    const point = req.body.point;
    const gender = req.body.gender;
    
    

    const newCustomer = new customer({
        customer_id,
        customer_name,
        email,
        point,
        gender
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

router.route("/update/:customer_id").put(async (req, res) => {
    let cus_id = req.params.customer_id;
    const { customer_id, customer_name, email, point, gender } = req.body;

    const updateCustomer = {
        customer_id,
        customer_name,
        email,
        point,
        gender
    }

    try {
        // Update the customer record based on the custom customer_id
        const updatedCustomer = await customer.findOneAndUpdate({ customer_id: cus_id }, updateCustomer, { new: true });

        if (updatedCustomer) {
            res.status(200).send({ status: "Customer Details updated", updatedCustomer });
        } else {
            res.status(404).send({ status: "Customer not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with Updating Details" });
    }
})


router.route("/delete/:customer_id").delete(async (req, res) => {
    let cus_id = req.params.customer_id; // Corrected from req.params.id

    try {
        // Delete the customer based on the custom customer_id
        const deletedCustomer = await customer.findOneAndDelete({ customer_id: cus_id });

        if (deletedCustomer) {
            res.status(200).send({ status: "Customer deleted", deletedCustomer });
        } else {
            res.status(404).send({ status: "Customer not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with deleting customer" });
    }
})
router.route("/delete-all-points").delete(async (req, res) => {
    try {
        // Delete all customer loyalty points
        await customer.updateMany({}, { $set: { point: 0 } });

        res.status(200).send({ status: "All customer loyalty points deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error deleting all customer loyalty points" });
    }
})


router.route("/:id").get((req, res) => {
    const customer_id = req.params.id;

    customer.findOne({ customer_id: customer_id }).then((customer) => {
        if (!customer) {
            return res.status(404).json({ error: "customer not found" });
        }
        res.json(customer);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Failed to get customer details" });
    });
});

// nisal 

router.route("/points/:customer_id").get(async (req, res) => {
    let cus_id = req.params.customer_id;

    try {
        // Find the customer based on the custom customer_id
        const foundCustomer = await customer.findOne({ customer_id: cus_id });

        if (foundCustomer) {
            // Retrieve and send the points of the found customer
            const points = foundCustomer.point;
            res.status(200).send({ points });
        } else {
            res.status(404).send({ status: "Customer not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error retrieving points" });
    }
})



module.exports = router;
