const router = require("express").Router();
let customer = require("../models/coustomermodel");
const bills = require("../models/billlingmodel");

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

router.route("/count").get(async (req, res) => {
    try {
        const totalCustomers = await customer.countDocuments();
        res.json({ totalCustomers });
    } catch (error) {
        console.error("Error counting customers:", error);
        res.status(500).json({ error: "Error counting customers" });
    }
});


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
});

router.get("/calculate-loyalty-points/:customer_id", async (req, res) => {
    const { customer_id } = req.params;

    try {
        // Get the current date
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Find the bill for the current day and the specified customer ID
        const bill = await bills.aggregate([
            {
                $match: {
                    customer_id,
                    billing_date: { $gte: startOfDay, $lt: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$total_amount" }
                }
            }
        ]);

        if (bill.length === 0) {
            return res.status(404).json({ error: "No bill found for the customer for today." });
        }

        const totalAmount = bill[0].totalAmount;

        // Ensure totalAmount is a number and not NaN
        if (!isNaN(totalAmount)) {
            // Calculate loyalty points (example calculation, adjust as needed)
            let loyaltyPoints = 0;
            if (totalAmount >= 1000 && totalAmount < 2000) {
                loyaltyPoints = 1;
            } else if (totalAmount >= 2000 && totalAmount < 5000) {
                loyaltyPoints = 3;
            } else if (totalAmount >= 5000) {
                loyaltyPoints = 5;
            }

            // Fetch current loyalty points of the customer
            const customerData = await customer.findOne({ customer_id });

            if (!customerData) {
                return res.status(404).json({ error: "Customer not found." });
            }

            const currentPoints = customerData.point;

            // Calculate new total points (capped at 100)
            const newTotalPoints = Math.min(currentPoints + loyaltyPoints, 100);

            // Calculate points to be incremented
            const pointsToIncrement = newTotalPoints - currentPoints;

            // Update customer's loyalty points in the database
            await customer.findOneAndUpdate({ customer_id }, { point: newTotalPoints });

            // Return the loyalty points
            res.status(200).json({ loyaltyPoints: pointsToIncrement });
        } else {
            res.status(500).json({ error: "Error calculating loyalty points: Total amount is not a number." });
        }
    } catch (error) {
        console.error("Error calculating loyalty points:", error);
        res.status(500).json({ error: "Error calculating loyalty points" });
    }
});



module.exports = router;
