const router = require("express").Router();
let toys = require("../models/toysmodel");

router.route("/add").post((req,res)=>{
    const item_code = req.body.item_code;
    const item_name = req.body.item_name;
    const category = req.body.category;
    const quantity = req.body.quantity;
    const alert_quantity = req.body.alert_quantity;
    
    

    const newToysStock = new toys({
        item_code,
        item_name,
        category,
        quantity,
        alert_quantity
    })
    
    newToysStock.save().then(()=>{
        res.json("New toys Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    toys.find().then((toysmodel)=>{
        res.json(toysmodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:item_code").put(async (req, res) => {
    let itm_code = req.params.item_code;
    const { item_code, item_name, category, quantity, alert_quantity } = req.body;

    const updatetoys = {
        item_code,
        item_name,
        category,
        quantity,
        alert_quantity
    }

    try {
        // Update the toys record based on the custom item_code
        const updatedtoys = await toys.findOneAndUpdate({ item_code: itm_code }, updatetoys, { new: true });

        if (updatedtoys) {
            res.status(200).send({ status: "toys Details updated", updatedtoys });
        } else {
            res.status(404).send({ status: "toys not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with Updating Details" });
    }
})


router.route("/delete/:item_code").delete(async (req, res) => {
    let itm_code = req.params.item_code; // Corrected from req.params.id

    try {
        // Delete the toys based on the custom item_code
        const deletedtoys = await toys.findOneAndDelete({ item_code: itm_code });

        if (deletedtoys) {
            res.status(200).send({ status: "toys deleted", deletedtoys });
        } else {
            res.status(404).send({ status: "toys not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with deleting toys" });
    }
})

router.route("/:id").get((req, res) => {
    const item_code = req.params.id;

    toys.findOne({ item_code: item_code }).then((toys) => {
        if (!toys) {
            return res.status(404).json({ error: "toys not found" });
        }
        res.json(toys);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Failed to get toys details" });
    });
});

// nisal 

router.route("/quantitys/:item_code").get(async (req, res) => {
    let itm_code = req.params.item_code;

    try {
        // Find the toys based on the custom item_code
        const foundtoys = await toys.findOne({ item_code: itm_code });

        if (foundtoys) {
            // Retrieve and send the quantitys of the found toys
            const quantitys = foundtoys.quantity;
            res.status(200).send({ quantitys });
        } else {
            res.status(404).send({ status: "toys not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error retrieving quantitys" });
    }
})



module.exports = router;
