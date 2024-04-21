const router = require("express").Router();
const clothes = require("../models/clothesmodel");


router.route("/add").post((req,res)=>{
    const item_code = req.body.item_code;
    const item_name = req.body.item_name;
    const category = req.body.category;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const alert_quantity = req.body.alert_quantity;


    
    

    const newClothesStock = new clothes({
        item_code,
        item_name,
        category,
        price,
        quantity,
        alert_quantity
    })
    
    newClothesStock.save().then(()=>{
        res.json("New clothes Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    clothes.find().then((clothesmodel)=>{
        res.json(clothesmodel)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:item_code").put(async (req, res) => {
    let itm_code = req.params.item_code;
    const { item_code, item_name, category, price, quantity, alert_quantity } = req.body;

    const updateclothes = {
        item_code,
        item_name,
        category,
        price,
        quantity,
        alert_quantity
    }

    try {
        // Update the clothes record based on the custom item_code
        const updatedclothes = await clothes.findOneAndUpdate({ item_code: itm_code }, updateclothes, { new: true });

        if (updatedclothes) {
            res.status(200).send({ status: "clothes Details updated", updatedclothes });
        } else {
            res.status(404).send({ status: "clothes not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with Updating Details" });
    }
})


router.route("/delete/:item_code").delete(async (req, res) => {
    let itm_code = req.params.item_code; // Corrected from req.params.id

    try {
        // Delete the clothes based on the custom item_code
        const deletedclothes = await clothes.findOneAndDelete({ item_code: itm_code });

        if (deletedclothes) {
            res.status(200).send({ status: "clothes deleted", deletedclothes });
        } else {
            res.status(404).send({ status: "clothes not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with deleting clothes" });
    }
})

router.route("/:id").get((req, res) => {
    const item_code = req.params.id;

    clothes.findOne({ item_code: item_code }).then((clothes) => {
        if (!clothes) {
            return res.status(404).json({ error: "clothes not found" });
        }
        res.json(clothes);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Failed to get clothes details" });
    });
});



router.route("/quantitys/:item_code").get(async (req, res) => {
    let itm_code = req.params.item_code;

    try {
        // Find the clothes based on the custom item_code
        const foundclothes = await clothes.findOne({ item_code: itm_code });

        if (foundclothes) {
            // Retrieve and send the quantitys of the found clothes
            const quantitys = foundclothes.quantity;
            res.status(200).send({ quantitys });
        } else {
            res.status(404).send({ status: "clothes not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error retrieving quantitys" });
    }
})

router.route("/decrement/:item_code").put(async (req, res) => {
    const item_code = req.params.item_code;
    const purchasedQuantity = req.body.quantity; // Access quantity from request body

    try {
        const clothe = await clothes.findOne({ item_code });
        if (!clothe) {
            return res.status(404).json({ error: "Clothes not found" });
        }

        const updatedQuantity = clothe.quantity - purchasedQuantity;
        if (updatedQuantity < 0) {
            return res.status(400).json({ error: "Insufficient quantity" });
        }

        clothe.quantity = updatedQuantity;

        await clothe.save();
        res.json({ message: "Clothes quantity updated", updatedQuantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.route("/decrease/:item_code").put(async (req, res) => {
    const itm_code = req.params.item_code;
    const quantityToDecrease = req.body.quantity; // Quantity to decrease

    try {
        // Find the clothes based on the custom item_code
        const foundClothes = await clothes.findOne({ item_code: itm_code });

        if (foundClothes) {
            // Check if there's enough quantity to decrease
            if (foundClothes.quantity >= quantityToDecrease) {
                // Decrease the quantity
                foundClothes.quantity -= quantityToDecrease;
                
                // Save the updated quantity
                await foundClothes.save();

                res.status(200).send({ status: "Quantity decreased", updatedClothes: foundClothes });
            } else {
                res.status(400).send({ status: "Not enough quantity to decrease" });
            }
        } else {
            res.status(404).send({ status: "Clothes not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error decreasing quantity" });
    }
})




module.exports = router;
