// itemrouts.js
const router = require("express").Router();
const Item = require("../models/itemtest");

// Add new item
router.route("/add").post((req, res) => {
    const { item_id, price } = req.body;

    const newItem = new Item({
        item_id,
        price
    });

    newItem.save()
        .then(() => {
            res.json("New Item Added");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to add new item" });
        });
});

// Get item price by ID
router.route("/price/:item_id").get(async (req, res) => {
    const item_id = req.params.item_id;

    try {
        const foundItem = await Item.findOne({ item_id });

        if (foundItem) {
            const price = foundItem.price;
            res.status(200).json({ price });
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error retrieving item price" });
    }
});

module.exports = router;
