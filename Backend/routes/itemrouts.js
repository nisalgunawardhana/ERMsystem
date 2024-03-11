const router = require("express").Router();
let item = require("../models/itemtest");

router.route("/add").post((req,res)=>{
    const item_id = req.body.item_id;
    const price = req.body.price;
    

    const newitem = new item({
        item_id,
        price
        
    })
    
    newitem.save().then(()=>{
        res.json("New Customer Added")
    }).catch((err)=>{
        console.log(err);
    })
})



router.route("/price/:item_id").get(async (req, res) => {
    let cus_id = req.params.item_id;

    try {
        // Find the customer based on the custom customer_id
        const foundItem = await item.findOne({ item_id: cus_id });

        if (foundItem) {
            // Retrieve and send the points of the found customer
            const price = foundItem.price;
            res.status(200).send({ price });
        } else {
            res.status(404).send({ status: "Customer not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error retrieving points" });
    }
})



module.exports = router;
