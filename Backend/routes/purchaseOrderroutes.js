const router = require("express").Router();
let purchaseOrder = require("../models/purchaseOrdermodel");

//CREATE
router.route("/add").post((req,res)=>{
    const purchaseOrder_id = req.body.purchaseOrder_id;
    const supplier_id =  req.body.supplier_id;
    const supplier_name = req.body.supplier_name;
    const order_date = req.body.order_date;
    const deliver_date = req.body.deliver_date;
    const order_items = req.body.order_items;
    const order_amount = req.body.order_amount;
    const delivery_information = req.body.delivery_information;
    const payment_information = req.body.payment_information;
    const additional_infomation = req.body.additional_infomation;
    const invoice_no = req.body.invoice_no;
    const total_order_amount = req.body.total_order_amount;
    const order_status = req.body.order_status;
    const payment_status = req.body.payment_status;
    const payment_date = req.body.payment_date;
    const sup_deliver_date = req.body.sup_deliver_date;
    const leadTime = req.body.leadTime;
    const qualityOfGoods = req.body.qualityOfGoods;
    const quantityAccuracy = req.body.quantityAccuracy;
    const responsiveness = req.body.responsiveness;
    const costEffectiveness = req.body.costEffectiveness;
    const additional = req.body.additional;
    const overallSatisfaction = req.body.overallSatisfaction;

    const newPurchaseOrder = new purchaseOrder({
        purchaseOrder_id,
        supplier_id,
        supplier_name,
        order_date,
        deliver_date,
        order_items,
        order_amount,
        delivery_information,
        payment_information,
        additional_infomation,
        invoice_no,
        total_order_amount,
        order_status,
        payment_status,
        payment_date, 
        sup_deliver_date, 
        leadTime, 
        qualityOfGoods, 
        quantityAccuracy, 
        responsiveness, 
        costEffectiveness, 
        additional,
        overallSatisfaction
    })
    
    newPurchaseOrder.save().then(()=>{
        res.json("New Purchase Order (PO) Added");
    }).catch((err)=>{
        console.log(err);
    })
})


//READ
router.route("/").get((req,res)=>{
    purchaseOrder.find().then((purchaseOrdermodel)=>{
        res.json(purchaseOrdermodel)
    }).catch((err)=>{
        console.log(err)
    })
})


//UPDATE
router.route("/update/:id").put(async (req,res)=>{
    let poID = req.params.id;
    const {purchaseOrder_id, supplier_id, supplier_name, order_date, deliver_date, order_items, order_amount, delivery_information, payment_information, additional_infomation, invoice_no, total_order_amount, order_status, payment_status, payment_date, sup_deliver_date, leadTime, qualityOfGoods, quantityAccuracy, responsiveness, costEffectiveness, additional,  overallSatisfaction} = req.body;

    const updatePO = {
        purchaseOrder_id,
        supplier_id,
        supplier_name,
        order_date,
        deliver_date,
        order_items,
        order_amount,
        delivery_information,
        payment_information,
        additional_infomation,
        invoice_no,
        total_order_amount,
        order_status,
        payment_status,
        payment_date, 
        sup_deliver_date, 
        leadTime, 
        qualityOfGoods, 
        quantityAccuracy, 
        responsiveness, 
        costEffectiveness, 
        additional,
        overallSatisfaction
    }

    const update = await purchaseOrder.findByIdAndUpdate(poID, updatePO).then(() => {
        res.status(200).send({status: "Purchase Order (PO) updated"})
    }).catch((errr) => {
        console.log(errr);
        res.status(500).send({status: "Error with updating Purchase Order"});
    })
})


//DELETE
router.delete('/delete/:id', async (req, res) => {
    try {
      const deletedOrder = await purchaseOrder.findByIdAndDelete(req.params.id);
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Purchase order not found' });
      }
      res.json({ message: 'Purchase order deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//GET ONE PURCHASE ORDER
router.route("/get/:id").get(async (req,res) => {
    let poID = req.params.id;
    const purchaseO = await purchaseOrder.findById(poID)
    .then((po) => {
        res.status(200).send({status: "Purchase Order fetched", po})
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with getting purchase Order", error: err.message});
    })
})

//GET TOTAL ORDER AMOUNTS
// router.get('/total', async (req, res) => {
//     try {
//         const result = await purchaseOrder.aggregate([
//             {
//                 $group: {
//                     _id: null,
//                     totalAmount: { $sum: "$total_order_amount" }
//                 }
//             }
//         ]);
//         res.json(result[0]);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.get('/total', async (req, res) => {
    try {
        const result = await purchaseOrder.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: { $toDouble: "$total_order_amount" } } // Convert to double
                }
            }
        ]);
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//GET PURCHASE ORDER IDS BY MONTH
router.get('/idsByMonth/:month', async (req, res) => {
    const { month } = req.params;
    try {
        const purchaseOrders = await purchaseOrder.find();
        const purchaseOrderIDs = purchaseOrders
            .filter(order => {
                const orderMonth = new Date(order.order_date).getMonth();
                return orderMonth === getMonthNumber(month); // Convert month name to number
            })
            .map(order => order.purchaseOrder_id);
        res.json({ purchaseOrderIDs });
    } catch (error) {
        console.error("Error fetching purchase orders by month:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Function to convert month name to number
const getMonthNumber = (monthName) => {
    const months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    return months[monthName];
};


// GET PURCHASE ORDERS FOR TODAY'S DATE
router.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const purchaseOrders = await purchaseOrder.find({ order_date: today });
        res.json({ purchaseOrders });
    } catch (error) {
        console.error("Error fetching purchase orders for today:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//DOWNLOAD PURCHASE ORDER
router.route("/download").get(async (req, res) => {
    try {
      const purchaseOrders = await purchaseOrder.find();
      const fields = [
        "purchaseOrder_id",
        "supplier_id",
        "supplier_name",
        "order_date",
        "deliver_date",
        "order_amount",
        "delivery_information.delivery_method",
        "delivery_information.delivery_costs",
        "payment_information.payment_terms",
        "payment_information.payment_method",
        "additional_infomation",
        "invoice_no",
        "total_order_amount",
        "order_status",
        "payment_status",
      ]; 
      const json2csv = require('json2csv').parse;
  
      const csv = json2csv(purchaseOrders, { fields });
  
      // Send the CSV data in the response
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=purchase_orders.csv');
      res.status(200).send(csv);
    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ error: "Error generating CSV" });
    }
  });
  


//   router.get("/:purchaseOrderId", async (req, res) => {
//     const { purchaseOrderId } = req.params;
//     try {
//         // Find a purchase order with the specified purchaseOrder_id
//         const existingPurchaseOrder = await purchaseOrder.findOne({ purchaseOrder_id: purchaseOrderId });
        
//         // Check if a purchase order with the specified ID exists
//         if (existingPurchaseOrder) {
//             // If the purchase order exists, return a response indicating its existence
//             res.json({ exists: true });
//         } else {
//             // If the purchase order does not exist, return a response indicating its non-existence
//             res.json({ exists: false });
//         }
//     } catch (error) {
//         // Handle any errors that occur during the database operation
//         console.error("Error checking purchase order ID:", error);
//         res.status(500).json({ error: "Error checking purchase order ID" });
//     }
// });

// Backend Route to check if Purchase Order ID exists
router.get("/check/:purchaseOrderID", async (req, res) => {
    const { purchaseOrderID } = req.params;
    try {
        const existingPurchaseOrder = await purchaseOrder.findOne({ purchaseOrder_id: purchaseOrderID });
        if (existingPurchaseOrder) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking purchase order ID:", error);
        res.status(500).json({ error: "Error checking purchase order ID" });
    }
});



module.exports = router;
